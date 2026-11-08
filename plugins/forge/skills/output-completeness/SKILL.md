---
disable-model-invocation: true  # skl: on-demand pack skill
name: output-completeness
description: Enforce complete, unabridged output - no placeholders, elisions or "rest is similar" shortcuts; when a response will hit the token limit, stop at a clean boundary with an explicit continue marker. Use when the user asks for a full file, all N items, a complete implementation, "don't truncate", or when you notice yourself abbreviating generated code or documents.
---

# Output Completeness

A partial output is a broken output. If the user asks for a full file, deliver the full file; if they ask for 5 components, deliver 5. This is about what you hand over, not about padding: concise prose is fine, elided deliverables are not.

## Banned patterns

- In code: `// ...`, `// rest of code`, `// implement here`, `// TODO` standing in for work you were asked to do, `/* ... */`, `// similar to above`, `// add more as needed`, bare `...` replacing omitted code.
- In prose: "for brevity", "the rest follows the same pattern", "similarly for the remaining", "and so on" replacing real content, "I'll leave that as an exercise", "let me know if you want me to continue" used to dodge finishing.
- Structure: a skeleton when a full implementation was requested; first and last sections with the middle skipped; one example plus a description of the rest; describing code instead of writing it.

(When editing an existing file with a targeted edit tool, do not rewrite the file; this rule applies to content you present as the deliverable.)

## Process

1. Scope: count the distinct deliverables requested (files, functions, sections, answers) and lock the number.
2. Build every one completely.
3. Cross-check before sending: re-read the request, compare against the count, scan for banned patterns.

## Approaching the output limit

- Do not compress remaining sections or jump to a conclusion to fit.
- Write at full quality up to a clean boundary (end of a function, file or section), then end with:

```
[PAUSED - X of Y complete. Send "continue" to resume from: <next section>]
```

- On "continue", resume exactly there with no recap or repetition.
- For very large generated files, prefer writing them to disk in pieces with your file tools over pasting them in chat.
