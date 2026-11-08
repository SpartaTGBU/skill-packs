# report.json schema (schemaVersion 1)

Written to `<out>/report.json` by `render-check.mjs`. All paths are absolute.

```jsonc
{
  "schemaVersion": 1,
  "html": "/abs/path/to/input.html",
  "generatedAt": "2026-10-03T21:00:00.000Z",  // ISO-8601
  "elapsedMs": 1520,                            // total wall time
  "axeAvailable": true,                         // was axe-core loaded for contrast?
  "refMode": false,                             // was --ref supplied?
  "overall": {
    "passed": true,                             // AND of every viewport.passed
    "viewports": 2                              // count
  },
  "viewports": [
    {
      "viewport": "1280x800",                   // label as given on CLI
      "width": 1280,
      "height": 800,
      "screenshot": "/abs/out/screenshot-1280x800.png",
      "consoleErrors": ["..."],                 // console.error + uncaught pageerror strings
      "failedRequests": [                        // network failures / HTTP >= 400
        { "url": "...", "failure": "net::ERR_..." },
        { "url": "...", "status": 404 }
      ],
      "overflow": {
        "hasOverflow": false,                   // horizontal overflow present?
        "scrollWidth": 1280,
        "clientWidth": 1280
      },
      "clippedText": [                           // elements whose text is cut by overflow:hidden/clip
        {
          "tag": "div",
          "text": "first 60 chars...",
          "scrollHeight": 120, "clientHeight": 18,
          "scrollWidth": 160, "clientWidth": 160
        }
      ],
      "contrast": {
        "available": true,                      // false if axe-core absent or errored
        "violations": [                          // axe color-contrast violations
          {
            "id": "color-contrast",
            "impact": "serious",
            "nodes": [ { "target": ["..."], "summary": "..." } ]
          }
        ]
        // "error": "..."  // present only if axe injection failed
      },
      "passed": true,                            // all signals clean (incl. refDiff if present)
      "failures": ["horizontal overflow", "..."],// human-readable reasons when passed=false

      // Present only when --ref was supplied:
      "refDiff": {
        "refPath": "/abs/ref.png",
        "diffImage": "/abs/out/diff-1280x800.png",
        "mismatchedPixels": 1234,
        "totalPixels": 1024000,
        "diffScore": 0.0012,                     // mismatched / total  (0 = identical)
        "threshold": 0.02,                       // from --diff-threshold
        "sizeMismatch": false,                   // true if render/ref dimensions differ (compared on common crop)
        "passed": true                           // diffScore <= threshold
      }
    }
  ]
}
```

## Pass/fail rules

A viewport `passed` is `true` only when ALL of these hold:
- `consoleErrors` is empty
- `failedRequests` is empty
- `overflow.hasOverflow` is `false`
- `clippedText` is empty
- `contrast.violations` is empty (contrast is skipped, not failed, when axe-core is unavailable)
- `refDiff.passed` is `true` (only when `--ref` is given)

`overall.passed` is the AND of every viewport. The process exits:
- `0` — overall pass
- `1` — at least one hard failure
- `2` — usage/runtime error (bad args, missing file, launch failure)
