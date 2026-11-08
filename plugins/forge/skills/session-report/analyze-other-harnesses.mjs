#!/usr/bin/env node
/**
 * analyze-other-harnesses.mjs - usage report data for pi, hermes and opencode,
 * emitting the same JSON shape as analyze-sessions.mjs (Claude) so the same
 * template.html renders it. Node only (uses built-in node:sqlite, Node >= 22.5).
 * Read-only: never writes to the harness stores.
 *
 *   node analyze-other-harnesses.mjs --harness pi|hermes|opencode [--since 7d|24h|ISO] [--top N] [--dir <path>]
 *
 * Formats (inspected on a real install; schemas only, not conversation contents):
 *  pi       VERIFIED. ~/.pi/agent/sessions/<--cwd-slug-->/<ts>_<uuid>.jsonl. Lines:
 *           {type:"session",cwd,timestamp} then {type:"message",message:{role,
 *           usage:{input,output,cacheRead,cacheWrite,reasoning,totalTokens,cost},...}}.
 *           Per-API-call usage, so cache and per-turn numbers are real.
 *  hermes   Schema verified, token semantics partly assumed. ~/.hermes/state.db table
 *           `sessions` (started_at/ended_at epoch seconds, input/output/cache_read/
 *           cache_write/reasoning tokens, cwd, source, parent_session_id, title).
 *           Session-level aggregates only; assumes input_tokens excludes cache reads.
 *  opencode Schema verified, token semantics partly assumed. ~/.local/share/opencode/
 *           opencode.db tables `session` and `session_v2` (time_created/time_updated
 *           epoch ms, tokens_input/output/cache_read/cache_write, directory, title,
 *           parent_id). Session-level aggregates only; child sessions (parent_id)
 *           are reported as subagents.
 * Not available for hermes/opencode: cache breaks, skill attribution, per-prompt
 * attribution (top_prompts lists the heaviest SESSIONS instead).
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import readline from 'readline'

const argv = process.argv.slice(2)
const flag = (n, d) => {
  const i = argv.indexOf(n)
  if (i === -1) return d
  const v = argv[i + 1]
  return v === undefined || v.startsWith('--') ? true : v
}
const HARNESS = flag('--harness', null)
const TOP_N = parseInt(flag('--top', '15'), 10)
const SINCE = (() => {
  const s = flag('--since', null)
  if (!s) return null
  const m = /^(\d+)([dh])$/.exec(s)
  if (m) return new Date(Date.now() - parseInt(m[1], 10) * (m[2] === 'd' ? 864e5 : 36e5))
  const d = new Date(s)
  return isNaN(d) ? null : d
})()
const IDLE_GAP_MS = 5 * 60 * 1000
const home = os.homedir()

function newStats() {
  return { sessions: new Set(), apiCalls: 0, unc: 0, cw: 0, cr: 0, out: 0, human: 0,
    wall: 0, active: 0, subCalls: 0, subTokens: 0, first: null, last: null }
}
function addTo(s, id, u, t0, t1, active) {
  s.sessions.add(id)
  s.apiCalls += u.calls || 0
  s.unc += u.unc || 0; s.cw += u.cw || 0; s.cr += u.cr || 0; s.out += u.out || 0
  s.human += u.human || 0
  s.wall += Math.max(0, t1 - t0); s.active += active
  s.first = s.first === null ? t0 : Math.min(s.first, t0)
  s.last = s.last === null ? t1 : Math.max(s.last, t1)
}
const total = u => u.unc + u.cw + u.cr + u.out

// ---- collect: array of {id, project, t0, t1, active, sub, subType, title, usage{calls,unc,cw,cr,out,human}}
async function collectPi() {
  const root = flag('--dir', path.join(home, '.pi', 'agent', 'sessions'))
  const out = []
  const files = []
  const walk = d => { let es; try { es = fs.readdirSync(d, { withFileTypes: true }) } catch { return }
    for (const e of es) { const p = path.join(d, e.name); e.isDirectory() ? walk(p) : e.name.endsWith('.jsonl') && files.push(p) } }
  walk(root)
  for (const f of files) {
    const rl = readline.createInterface({ input: fs.createReadStream(f), crlfDelay: Infinity })
    const sess = { id: path.basename(f, '.jsonl'), project: path.basename(path.dirname(f)), t0: null, t1: null,
      active: 0, sub: false, title: '', usage: { calls: 0, unc: 0, cw: 0, cr: 0, out: 0, human: 0 } }
    let prev = null, any = false
    for await (const line of rl) {
      let o; try { o = JSON.parse(line) } catch { continue }
      const ts = Date.parse(o.timestamp)
      if (o.type === 'session' && o.cwd) sess.project = o.cwd
      if (SINCE && !isNaN(ts) && ts < SINCE.getTime()) continue
      if (!isNaN(ts)) {
        if (prev !== null) sess.active += Math.min(ts - prev, IDLE_GAP_MS)
        prev = ts; sess.t0 = sess.t0 === null ? ts : Math.min(sess.t0, ts); sess.t1 = Math.max(sess.t1 ?? 0, ts)
      }
      const m = o.message
      if (o.type !== 'message' || !m) continue
      if (m.role === 'user') {
        sess.usage.human++
        if (!sess.title) { const c = m.content; const t = typeof c === 'string' ? c : (c || []).find(x => x.type === 'text')?.text; sess.title = (t || '').replace(/\s+/g, ' ').slice(0, 100) }
      } else if (m.role === 'assistant' && m.usage) {
        const u = m.usage; any = true
        sess.usage.calls++; sess.usage.unc += u.input || 0; sess.usage.cw += u.cacheWrite || 0
        sess.usage.cr += u.cacheRead || 0; sess.usage.out += u.output || 0
      }
    }
    if (any && sess.t0 !== null) out.push(sess)
  }
  return { root, sessions: out }
}

async function openDb(p) {
  const { DatabaseSync } = await import('node:sqlite')
  return new DatabaseSync(p, { readOnly: true })
}

async function collectHermes() {
  const db = await openDb(flag('--dir', path.join(home, '.hermes', 'state.db')))
  const since = SINCE ? SINCE.getTime() / 1000 : 0
  const rows = db.prepare(`SELECT id, source, cwd, started_at, ended_at, last_activity_at, input_tokens, output_tokens,
      cache_read_tokens, cache_write_tokens, api_call_count, message_count, parent_session_id,
      COALESCE(NULLIF(title,''), NULLIF(display_name,'')) AS title
      FROM sessions WHERE started_at >= ?`).all(since)
  const sessions = rows.map(r => {
    const t0 = r.started_at * 1000
    const t1 = (r.ended_at || r.last_activity_at || r.started_at) * 1000
    return { id: r.id, project: r.cwd || `(${r.source})`, t0, t1, active: t1 - t0,
      sub: !!r.parent_session_id || r.source === 'subagent', subType: r.source,
      title: (r.title || `(${r.source} session)`).replace(/\s+/g, ' ').slice(0, 100),
      usage: { calls: r.api_call_count || 0, unc: r.input_tokens || 0, cw: r.cache_write_tokens || 0,
        cr: r.cache_read_tokens || 0, out: r.output_tokens || 0, human: 0 } }
  })
  return { root: 'hermes state.db', sessions }
}

async function collectOpencode() {
  const db = await openDb(flag('--dir', path.join(home, '.local', 'share', 'opencode', 'opencode.db')))
  const since = SINCE ? SINCE.getTime() : 0
  const seen = new Set(), sessions = []
  for (const t of ['session_v2', 'session']) {
    let rows
    try {
      rows = db.prepare(`SELECT id, directory, title, parent_id, time_created, time_updated, tokens_input, tokens_output,
        tokens_cache_read, tokens_cache_write FROM ${t} WHERE time_created >= ?`).all(since)
    } catch { continue }
    for (const r of rows) {
      if (seen.has(r.id)) continue
      seen.add(r.id)
      sessions.push({ id: r.id, project: r.directory, t0: r.time_created, t1: r.time_updated || r.time_created,
        active: (r.time_updated || r.time_created) - r.time_created, sub: !!r.parent_id, subType: 'child-session',
        title: (r.title || '').replace(/\s+/g, ' ').slice(0, 100),
        usage: { calls: 0, unc: r.tokens_input || 0, cw: r.tokens_cache_write || 0, cr: r.tokens_cache_read || 0,
          out: r.tokens_output || 0, human: 0 } })
    }
  }
  return { root: 'opencode.db', sessions }
}

function summarize(s) {
  const inT = s.unc + s.cw + s.cr
  const h = ms => +(ms / 3600000).toFixed(1)
  return {
    sessions: s.sessions.size, api_calls: s.apiCalls,
    input_tokens: { uncached: s.unc, cache_create: s.cw, cache_read: s.cr, total: inT,
      pct_cached: inT > 0 ? +((100 * s.cr) / inT).toFixed(1) : 0 },
    output_tokens: s.out, human_messages: s.human, hours: { wall_clock: h(s.wall), active: h(s.active) },
    cache_breaks_over_100k: 0,
    subagent: { calls: s.subCalls, total_tokens: s.subTokens, avg_tokens_per_call: s.subCalls ? Math.round(s.subTokens / s.subCalls) : 0 },
    skill_invocations: {},
    span: s.first ? { from: new Date(s.first).toISOString(), to: new Date(s.last).toISOString() } : null,
  }
}

function byDay(sessions) {
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const days = new Map()
  for (const s of sessions) {
    const tk = total(s.usage); if (!tk) continue
    const d0 = new Date(s.t0)
    const key = `${d0.getFullYear()}-${String(d0.getMonth() + 1).padStart(2, '0')}-${String(d0.getDate()).padStart(2, '0')}`
    const day = days.get(key) || { date: key, dow: DOW[d0.getDay()], tokens: 0, sessions: [] }
    days.set(key, day)
    const base = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate()).getTime()
    day.tokens += tk
    day.sessions.push({ id: s.id, project: s.project, tokens: tk,
      start_min: Math.max(0, Math.round((s.t0 - base) / 60000)), end_min: Math.max(1, Math.round((s.t1 - base) / 60000)) })
  }
  for (const d of days.values()) {
    const b = new Array(144).fill(0)
    for (const s of d.sessions) {
      const lo = Math.min(143, Math.floor(s.start_min / 10)), hi = Math.min(144, Math.ceil(Math.min(s.end_min, 1440) / 10))
      for (let i = lo; i < hi; i++) b[i]++
    }
    d.peak = Math.max(0, ...b); d.peak_at_min = d.peak > 0 ? b.indexOf(d.peak) * 10 : 0
    d.sessions.sort((a, b) => a.start_min - b.start_min)
  }
  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date))
}

async function main() {
  const collectors = { pi: collectPi, hermes: collectHermes, opencode: collectOpencode }
  if (!collectors[HARNESS]) {
    console.error('usage: node analyze-other-harnesses.mjs --harness pi|hermes|opencode [--since 7d] [--top N] [--dir path]')
    process.exit(2)
  }
  const { root, sessions } = await collectors[HARNESS]()
  const overall = newStats(), proj = new Map(), subs = new Map()
  for (const s of sessions) {
    const g = (m, k) => { if (!m.has(k)) m.set(k, newStats()); return m.get(k) }
    addTo(overall, s.id, s.usage, s.t0, s.t1, s.active)
    addTo(g(proj, s.project), s.id, s.usage, s.t0, s.t1, s.active)
    if (s.sub) {
      for (const st of [overall, g(proj, s.project), g(subs, s.subType || 'subagent')]) { st.subCalls++; st.subTokens += total(s.usage) }
      if (subs.has(s.subType || 'subagent')) addTo(subs.get(s.subType || 'subagent'), s.id, s.usage, s.t0, s.t1, s.active)
    }
  }
  const top = [...sessions].sort((a, b) => total(b.usage) - total(a.usage)).slice(0, 100).map(s => ({
    ts: new Date(s.t0).toISOString(), project: s.project, session: s.id, text: s.title || '(untitled)',
    api_calls: s.usage.calls, subagent_calls: 0, total_tokens: total(s.usage),
    input: { uncached: s.usage.unc, cache_create: s.usage.cw, cache_read: s.usage.cr }, output: s.usage.out, context: null }))
  const sum = m => Object.fromEntries([...m].map(([k, v]) => [k, summarize(v)]))
  process.stdout.write(JSON.stringify({
    root, harness: HARNESS, generated_at: new Date().toISOString(),
    notes: HARNESS === 'pi' ? 'pi: per-call usage (verified).'
      : `${HARNESS}: session-level aggregates only; no cache-break, skill or per-prompt attribution; top_prompts = heaviest sessions.`,
    overall: summarize(overall), cache_breaks: [], by_project: sum(proj), by_subagent_type: sum(subs),
    by_skill: {}, top_prompts: top, by_day: byDay(sessions),
  }, null, 2) + '\n')
}
main().catch(e => { console.error(e); process.exit(1) })
