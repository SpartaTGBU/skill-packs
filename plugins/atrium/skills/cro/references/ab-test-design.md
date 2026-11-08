# A/B test design reference

Use with section 7 of the cro skill. All sample sizes below are approximations for planning;
confirm with any sample-size calculator or a stats library before committing traffic.

## Inputs to collect

| Input | Default | Notes |
|---|---|---|
| Baseline rate (p1) | from data | The conversion rate of the exact step tested, recent 2-4 weeks |
| Minimum detectable effect (MDE) | ask | Smallest relative lift worth shipping; business call, not a stats one |
| Significance (alpha) | 0.05 two-sided | 95% confidence |
| Power (1 - beta) | 0.80 | 80% chance to detect a true effect of size MDE |
| Arms | 2 | Control + one variant |
| Daily eligible traffic | from data | Visitors who reach the tested element |
| Exposure share | 100% | Share of eligible traffic entered into the test |

## Sample size per arm (two proportions)

n per arm ~= (z_alpha/2 + z_beta)^2 x [p1(1 - p1) + p2(1 - p2)] / (p2 - p1)^2

- p2 = p1 x (1 + relative MDE).
- alpha 0.05 and power 0.80 give (1.96 + 0.84)^2 ~= 7.84.
- Worked check: p1 = 5%, p2 = 6% gives 7.84 x (0.0475 + 0.0564) / 0.0001 ~= 8,150 per arm.

Approximate visitors per arm (alpha 0.05, power 0.80, relative lift):

| Baseline | 10% lift | 20% lift | 50% lift |
|---|---|---|---|
| 1% | ~160,000 | ~43,000 | ~7,700 |
| 3% | ~53,000 | ~14,000 | ~2,500 |
| 5% | ~31,000 | ~8,200 | ~1,500 |
| 10% | ~15,000 | ~3,800 | ~690 |
| 20% | ~6,500 | ~1,700 | ~290 |

Rules of thumb: halving the MDE roughly quadruples the sample; low baselines are expensive.
Continuous metrics (revenue per visitor, order value) need the metric's standard deviation and
usually much more sample because of skew; consider capping outliers, decided before launch.

## More than two arms

- Each extra variant needs its own full sample: 3 arms ~1.5x total traffic of A/B for the same
  per-arm n, 4 arms ~2x.
- Comparing several variants to control inflates false positives. Correct for it: Bonferroni
  (alpha / number of comparisons) is simple and conservative, which raises n per arm further.
- Multivariate (factorial) tests need traffic for every combination; only for very high volume.

## Duration

days = n per arm x arms / (daily eligible visitors x exposure share)

Unequal split (e.g. 90/10 for risk): days = max over arms of n / (daily x exposure x allocation).
The smallest arm sets the duration.

| Estimated duration | Verdict |
|---|---|
| < 14 days | Fine; still run at least one full week |
| 14-30 days | Acceptable; confirm nothing else changes on the page meanwhile |
| 30-60 days | Only for high-impact decisions; check novelty and cookie churn |
| > 60 days | Don't run as designed; use a low-traffic option below |

Timing rules:
- Whole weeks only, minimum one week, to cover weekday/weekend behavior.
- B2B: cover at least two business cycles (often two weeks or more).
- Ecommerce: span a pay cycle; avoid sales events and holidays unless that is the question.
- Cap around 4-8 weeks: novelty effects fade, cookies expire, users switch devices.

## Low-traffic options

1. Accept a larger MDE (test bolder changes).
2. Use 90% confidence, decided and documented before launch, accepting more false positives.
3. Fewer arms: A/B only.
4. Pool similar pages (all product pages, all blog CTAs) into one template-level test.
5. Test upstream on a higher-volume step, or use a higher-volume proxy metric that is known to
   correlate with the real goal.
6. Don't test: ship the change backed by qualitative evidence (interviews, recordings, usability
   tests) and monitor before/after, labeled as non-causal.

## Peeking and sequential testing

- Fixed-horizon tests are only valid at the planned sample. Checking repeatedly and stopping at
  the first significant result multiplies the false-positive rate.
- Safe to look early only for broken tracking, bugs or a guardrail breach (stop for harm, not for
  a win).
- Need early stopping for real? Choose a sequential design (group sequential with alpha spending,
  or always-valid methods) or a Bayesian approach before launch, and interpret it by its own
  rules. Tradeoff: sequential designs usually need somewhat more sample if they run to the end.

## Reading results

- p-value: the probability of data this extreme if there were no true difference. It is not the
  probability the variant is better, nor the chance the result is "random".
- Confidence interval: the plausible range of the true effect. Report it with every result; an
  interval spanning zero is inconclusive, not "no effect".
- Statistical significance is not practical significance: check the lower bound against the MDE.
- Sample ratio mismatch (e.g. 50/50 planned, 52/48 observed on large n) signals broken assignment
  or tracking; investigate before trusting any result.
- Segment cuts not planned in advance are hypotheses for the next test.

Results table:

| Arm | Visitors | Conversions | Rate | Relative lift vs control | 95% CI | p-value |
|---|---|---|---|---|---|---|
| Control | | | | - | - | - |
| Variant B | | | | | | |

Decision: ship / keep control / iterate / inconclusive (with the interval).

## Prioritization (ICE)

| Idea | Impact (1-10) | Confidence (1-10) | Ease (1-10) | Score (avg) | Evidence |
|---|---|---|---|---|---|

Confidence comes from evidence (data, research, past tests), not enthusiasm.

## Test log template

```
Test: [name]                    Dates: [start] - [end]
Hypothesis: Because [evidence], we believe [change] will cause [effect] for [audience].
Primary metric: [ ]   Guardrails: [ ]   Baseline: [ ]   MDE: [ ]
Planned n per arm: [ ]   Arms/split: [ ]   Planned duration: [ ]
Result: [lift, 95% CI, p]   Guardrails: [ok / breached]   SRM check: [ok / issue]
Decision: [ship / revert / iterate]   Learning: [reusable pattern]
```

Cadence: check guardrails and tracking weekly, conclude tests only at plan, review the backlog
monthly.
