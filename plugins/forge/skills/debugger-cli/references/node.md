# Node.js debugging (node inspect + CDP)

## node inspect REPL (zero install)

```bash
node inspect path/to/script.js              # paused on first line
node --inspect-brk $(which tsx) script.ts   # TypeScript via tsx
node --inspect-brk --import tsx script.ts   # or: -r tsx/cjs on older tsx
```

`debug>` commands: `c`/`cont`, `n`/`next` (over), `s`/`step` (into), `o`/`out`, `pause`,
`sb('file.js', 42)` (also `sb(42)`, `sb('fnName')`), `cb('file.js', 42)`, `breakpoints`, `bt`,
`list(5)`, `watch('expr')`, `watchers`, `repl` (JS REPL in the paused scope, Ctrl+C returns),
`exec expr`, `restart`, `kill`, `.exit`.

## Start vs attach

```bash
node --inspect script.js          # listen on 127.0.0.1:9229, keep running
node --inspect-brk script.js      # listen AND pause on line 1 (use when breakpoints must precede execution)
node --inspect=0 script.js        # random port; read it from /json/list
kill -SIGUSR1 <pid>               # enable inspector on an already-running process
node inspect -p <pid>             # attach by PID (or: node inspect ws://127.0.0.1:9229/<uuid>)
curl -s http://127.0.0.1:9229/json/list   # list inspectable targets, confirm the right one
```

## Scripted CDP (automate many breakpoints / non-interactive)

```bash
mkdir -p "$TMPDIR/cdp" && cd "$TMPDIR/cdp" && npm i chrome-remote-interface   # keep out of the project
node --inspect-brk=9229 target.js &
NODE_PATH="$TMPDIR/cdp/node_modules" node cdp-debug.js
```

```javascript
const CDP = require('chrome-remote-interface');
(async () => {
  const client = await CDP({ port: 9229 });
  const { Debugger, Runtime } = client;
  Debugger.paused(async ({ callFrames, reason }) => {
    const top = callFrames[0];
    console.log(`PAUSED: ${reason} @ ${top.url}:${top.location.lineNumber + 1}`);
    for (const scope of top.scopeChain) {
      if (scope.type === 'local' || scope.type === 'closure') {
        const { result } = await Runtime.getProperties({ objectId: scope.object.objectId, ownProperties: true });
        for (const p of result) console.log(`  ${scope.type}.${p.name} =`, p.value?.value ?? p.value?.description);
      }
    }
    const { result } = await Debugger.evaluateOnCallFrame({
      callFrameId: top.callFrameId,
      expression: 'typeof state !== "undefined" ? JSON.stringify(state) : "n/a"',
    });
    console.log('state =', result.value ?? result.description);
    await Debugger.resume();
  });
  await Runtime.enable();
  await Debugger.enable();
  await Debugger.setBreakpointByUrl({ urlRegex: '.*app\\.tsx$', lineNumber: 119, columnNumber: 0 }); // 0-indexed
  await Runtime.runIfWaitingForDebugger();
})();
```

### CPU profile and heap snapshot

```javascript
await client.Profiler.enable(); await client.Profiler.start();
await new Promise(r => setTimeout(r, 5000));
const { profile } = await client.Profiler.stop();
require('fs').writeFileSync('cpu.cpuprofile', JSON.stringify(profile)); // open in DevTools > Performance

await client.HeapProfiler.enable();
const chunks = [];
client.HeapProfiler.addHeapSnapshotChunk(({ chunk }) => chunks.push(chunk));
await client.HeapProfiler.takeHeapSnapshot({ reportProgress: false });
require('fs').writeFileSync('heap.heapsnapshot', chunks.join(''));
```

## Test runners

```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs run --no-file-parallelism path/to/foo.test.ts
# jest: node --inspect-brk node_modules/.bin/jest --runInBand path/to/foo.test.ts
# then: node inspect -p <pid>; sb('src/foo.ts', 42); cont
```

## Pitfalls

1. TypeScript line numbers: breakpoints hit emitted JS. Break in built `dist/*.js`, or use
   `--enable-source-maps` with a CDP client that follows source maps (`node inspect` CLI does not).
2. `--inspect` does not pause; attach late and you race past the breakpoint. Use `--inspect-brk`.
3. Port collisions on 9229: use `--inspect=0` and read `/json/list`.
4. Children are not inspected by the parent flag. `NODE_OPTIONS='--inspect-brk'` propagates (each gets its own port).
5. Exiting `node inspect` while paused leaves the target paused: `cont` or `kill` first.
6. `node inspect` needs a PTY for stepping; non-PTY works for one-shot commands only.
7. Never bind the inspector to a public interface.

## Checklist

- `/json/list` shows exactly the expected target
- first breakpoint hits (else `--inspect-brk` missing or attached after exit)
- source listing at pause is the file you intended (else sourcemap issue)
- in `repl`: `process.pid` is the PID you meant
