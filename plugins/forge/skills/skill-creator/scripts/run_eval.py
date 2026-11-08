#!/usr/bin/env python3
"""Run trigger evaluation for a skill description (harness-neutral).

Real skill-trigger detection differs per harness, so this simulates the routing
decision: the runner (SKILL_EVAL_CMD, see evalrunner.py) is shown an
available-skills list containing the skill under test (with the candidate
description) plus distractor skills, and is asked which skill, if any, it would
load for the query. Each query is repeated --runs-per-query times. Outputs JSON.

Distractors: other skills found next to the skill under test (sibling dirs
with SKILL.md), up to --max-distractors.
"""

import argparse
import json
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from scripts.evalrunner import call_llm
from scripts.utils import parse_skill_md


def load_distractors(skill_path: Path, limit: int) -> list[tuple[str, str]]:
    out = []
    for sib in sorted(skill_path.resolve().parent.iterdir()):
        if sib.resolve() == skill_path.resolve() or not (sib / "SKILL.md").exists():
            continue
        try:
            n, d, _ = parse_skill_md(sib)
            out.append((n, d))
        except Exception:
            continue
        if len(out) >= limit:
            break
    return out


def build_prompt(query: str, skill_name: str, description: str, distractors) -> str:
    entries = [(skill_name, description)] + list(distractors)
    # Stable but not position-biased: sort by name.
    entries.sort(key=lambda e: e[0])
    listing = "\n".join(f"- {n}: {d}" for n, d in entries)
    return (
        "You are an agent with access to the skills listed below. A skill is a "
        "bundle of instructions you load only when the user's request would "
        "clearly benefit from it; you handle simple one-step requests directly.\n\n"
        f"<available_skills>\n{listing}\n</available_skills>\n\n"
        f"<user_request>\n{query}\n</user_request>\n\n"
        "Which single skill would you load before answering? Reply with exactly "
        "<skill>NAME</skill>, or <skill>none</skill> if no skill is needed. "
        "No other text."
    )


def run_single_query(query, skill_name, description, distractors, timeout, model=None) -> bool:
    text = call_llm(build_prompt(query, skill_name, description, distractors), model, timeout)
    m = re.search(r"<skill>\s*(.*?)\s*</skill>", text, re.DOTALL)
    return bool(m) and m.group(1).strip().strip("`") == skill_name


def run_eval(
    eval_set: list[dict],
    skill_name: str,
    description: str,
    num_workers: int,
    timeout: int,
    runs_per_query: int = 1,
    trigger_threshold: float = 0.5,
    model: str | None = None,
    distractors=(),
) -> dict:
    """Run the full eval set and return results."""
    query_triggers: dict[str, list[bool]] = {}
    query_items: dict[str, dict] = {}
    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        future_to_item = {}
        for item in eval_set:
            for _ in range(runs_per_query):
                f = executor.submit(
                    run_single_query, item["query"], skill_name, description,
                    distractors, timeout, model,
                )
                future_to_item[f] = item
        for future in as_completed(future_to_item):
            item = future_to_item[future]
            query_items[item["query"]] = item
            query_triggers.setdefault(item["query"], [])
            try:
                query_triggers[item["query"]].append(future.result())
            except Exception as e:
                print(f"Warning: query failed: {e}", file=sys.stderr)
                query_triggers[item["query"]].append(False)

    results = []
    for query, triggers in query_triggers.items():
        item = query_items[query]
        rate = sum(triggers) / len(triggers)
        should = item["should_trigger"]
        did_pass = rate >= trigger_threshold if should else rate < trigger_threshold
        results.append({
            "query": query, "should_trigger": should, "trigger_rate": rate,
            "triggers": sum(triggers), "runs": len(triggers), "pass": did_pass,
        })
    passed = sum(1 for r in results if r["pass"])
    return {
        "skill_name": skill_name,
        "description": description,
        "results": results,
        "summary": {"total": len(results), "passed": passed, "failed": len(results) - passed},
    }


def main():
    parser = argparse.ArgumentParser(description="Run trigger evaluation for a skill description")
    parser.add_argument("--eval-set", required=True, help="Path to eval set JSON file")
    parser.add_argument("--skill-path", required=True, help="Path to skill directory")
    parser.add_argument("--description", default=None, help="Override description to test")
    parser.add_argument("--num-workers", type=int, default=4, help="Number of parallel workers")
    parser.add_argument("--timeout", type=int, default=120, help="Timeout per query in seconds")
    parser.add_argument("--runs-per-query", type=int, default=3, help="Number of runs per query")
    parser.add_argument("--trigger-threshold", type=float, default=0.5, help="Trigger rate threshold")
    parser.add_argument("--max-distractors", type=int, default=15, help="Sibling skills to include as distractors")
    parser.add_argument("--model", default=None, help="Model name (only used if SKILL_EVAL_MODEL_FLAG is set)")
    parser.add_argument("--verbose", action="store_true", help="Print progress to stderr")
    args = parser.parse_args()

    eval_set = json.loads(Path(args.eval_set).read_text())
    skill_path = Path(args.skill_path)
    if not (skill_path / "SKILL.md").exists():
        print(f"Error: No SKILL.md found at {skill_path}", file=sys.stderr)
        sys.exit(1)

    name, original_description, _ = parse_skill_md(skill_path)
    description = args.description or original_description
    if args.verbose:
        print(f"Evaluating: {description}", file=sys.stderr)

    output = run_eval(
        eval_set=eval_set, skill_name=name, description=description,
        num_workers=args.num_workers, timeout=args.timeout,
        runs_per_query=args.runs_per_query, trigger_threshold=args.trigger_threshold,
        model=args.model, distractors=load_distractors(skill_path, args.max_distractors),
    )
    if args.verbose:
        s = output["summary"]
        print(f"Results: {s['passed']}/{s['total']} passed", file=sys.stderr)
        for r in output["results"]:
            print(f"  [{'PASS' if r['pass'] else 'FAIL'}] rate={r['triggers']}/{r['runs']} expected={r['should_trigger']}: {r['query'][:70]}", file=sys.stderr)
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
