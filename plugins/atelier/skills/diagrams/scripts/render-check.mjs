#!/usr/bin/env node
/*
 * render.js — Playwright render + screenshot + verify loop.
 *
 * Renders an HTML file headlessly, captures a full-page screenshot per
 * viewport, and reports verification signals: console errors, failed network
 * requests, horizontal overflow, clipped text, and (if axe-core is available)
 * basic color-contrast violations. Optionally diffs the render against a
 * reference PNG with pixelmatch.
 *
 * Usage:
 *   node render.js <html_path> [--ref <png>] [--viewports 1280x800,390x844] [--out dir]
 *
 * See REPORT_SCHEMA.md for the report.json schema.
 *
 * Exit codes:
 *   0  all viewports passed
 *   1  at least one hard failure (console error, failed request, overflow,
 *      clipped text, contrast violation, or ref diff above threshold)
 *   2  usage / runtime error (bad args, file not found, launch failure)
 */

import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

// ---- CLI parsing -----------------------------------------------------------
function parseArgs(argv) {
  const args = { html: null, ref: null, viewports: '1280x800,390x844', out: 'render-out', diffThreshold: 0.02 };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--ref') args.ref = argv[++i];
    else if (a === '--viewports') args.viewports = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--diff-threshold') args.diffThreshold = parseFloat(argv[++i]);
    else if (a === '-h' || a === '--help') args.help = true;
    else rest.push(a);
  }
  args.html = rest[0] || null;
  return args;
}

function parseViewports(spec) {
  return spec.split(',').map((s) => {
    const m = s.trim().match(/^(\d+)x(\d+)$/);
    if (!m) throw new Error(`Bad viewport "${s}". Expected WxH like 1280x800.`);
    return { label: s.trim(), width: parseInt(m[1], 10), height: parseInt(m[2], 10) };
  });
}

const USAGE = `Usage: node render.js <html_path> [--ref <png>] [--viewports 1280x800,390x844] [--out dir] [--diff-threshold 0.02]`;

// Load axe-core source once (optional dependency).
async function getAxeSource() {
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const axePath = require.resolve('axe-core');
    return fs.readFileSync(axePath, 'utf8');
  } catch {
    return null;
  }
}

// ---- Per-viewport render ---------------------------------------------------
async function renderViewport(browser, fileUrl, viewport, outDir, axeSource) {
  const consoleErrors = [];
  const failedRequests = [];
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    failedRequests.push({ url: req.url(), failure: (req.failure() && req.failure().errorText) || 'unknown' });
  });
  page.on('response', (resp) => {
    if (resp.status() >= 400) failedRequests.push({ url: resp.url(), status: resp.status() });
  });

  await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 15000 });

  // Horizontal overflow: document wider than viewport.
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    const scrollW = Math.max(de.scrollWidth, document.body ? document.body.scrollWidth : 0);
    const clientW = de.clientWidth;
    return { hasOverflow: scrollW > clientW + 1, scrollWidth: scrollW, clientWidth: clientW };
  });

  // Clipped text: elements whose content overflows a non-visible box.
  const clipped = await page.evaluate(() => {
    const out = [];
    const els = document.querySelectorAll('body *');
    for (const el of els) {
      if (!el.offsetParent && el.tagName !== 'BODY') continue;
      const txt = (el.textContent || '').trim();
      if (!txt) continue;
      // only leaf-ish text nodes
      const hasElementChild = Array.from(el.children).some((c) => (c.textContent || '').trim());
      if (hasElementChild) continue;
      const style = getComputedStyle(el);
      const clipsY = ['hidden', 'clip'].includes(style.overflowY);
      const clipsX = ['hidden', 'clip'].includes(style.overflowX);
      const overY = el.scrollHeight > el.clientHeight + 1;
      const overX = el.scrollWidth > el.clientWidth + 1;
      if ((clipsY && overY) || (clipsX && overX)) {
        out.push({
          tag: el.tagName.toLowerCase(),
          text: txt.slice(0, 60),
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        });
      }
    }
    return out.slice(0, 20);
  });

  // Contrast via axe-core (optional).
  let contrast = { available: false, violations: [] };
  if (axeSource) {
    try {
      await page.addScriptTag({ content: axeSource });
      const results = await page.evaluate(async () => {
        // eslint-disable-next-line no-undef
        const r = await axe.run(document, { runOnly: ['color-contrast'] });
        return r.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.slice(0, 10).map((n) => ({ target: n.target, summary: n.failureSummary })),
        }));
      });
      contrast = { available: true, violations: results };
    } catch (e) {
      contrast = { available: false, error: e.message, violations: [] };
    }
  }

  // Screenshot.
  const shotPath = path.join(outDir, `screenshot-${viewport.label}.png`);
  await page.screenshot({ path: shotPath, fullPage: true });

  await page.close();

  const contrastViolations = contrast.violations.length;
  const passed =
    consoleErrors.length === 0 &&
    failedRequests.length === 0 &&
    !overflow.hasOverflow &&
    clipped.length === 0 &&
    contrastViolations === 0;

  return {
    viewport: viewport.label,
    width: viewport.width,
    height: viewport.height,
    screenshot: path.resolve(shotPath),
    consoleErrors,
    failedRequests,
    overflow,
    clippedText: clipped,
    contrast,
    passed,
    failures: [
      ...(consoleErrors.length ? [`${consoleErrors.length} console error(s)`] : []),
      ...(failedRequests.length ? [`${failedRequests.length} failed request(s)`] : []),
      ...(overflow.hasOverflow ? ['horizontal overflow'] : []),
      ...(clipped.length ? [`${clipped.length} clipped text element(s)`] : []),
      ...(contrastViolations ? [`${contrastViolations} contrast violation(s)`] : []),
    ],
  };
}

// ---- Reference diff --------------------------------------------------------
function diffAgainstRef(shotPath, refPath, diffPath, threshold) {
  const shot = PNG.sync.read(fs.readFileSync(shotPath));
  const ref = PNG.sync.read(fs.readFileSync(refPath));
  const width = Math.min(shot.width, ref.width);
  const height = Math.min(shot.height, ref.height);

  // Crop both to the common size so pixelmatch gets equal dimensions.
  const crop = (src) => {
    const dst = new PNG({ width, height });
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const si = (src.width * y + x) << 2;
        const di = (width * y + x) << 2;
        dst.data[di] = src.data[si];
        dst.data[di + 1] = src.data[si + 1];
        dst.data[di + 2] = src.data[si + 2];
        dst.data[di + 3] = src.data[si + 3];
      }
    }
    return dst;
  };
  const a = shot.width === width && shot.height === height ? shot : crop(shot);
  const b = ref.width === width && ref.height === height ? ref : crop(ref);

  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  const total = width * height;
  const score = total ? mismatched / total : 1;
  return {
    refPath: path.resolve(refPath),
    diffImage: path.resolve(diffPath),
    mismatchedPixels: mismatched,
    totalPixels: total,
    diffScore: score, // fraction of pixels differing (0 = identical)
    threshold,
    sizeMismatch: shot.width !== ref.width || shot.height !== ref.height,
    passed: score <= threshold,
  };
}

// ---- Main ------------------------------------------------------------------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.html) {
    console.log(USAGE);
    process.exit(args.html ? 0 : 2);
  }
  if (!fs.existsSync(args.html)) {
    console.error(`Error: html file not found: ${args.html}`);
    process.exit(2);
  }
  if (args.ref && !fs.existsSync(args.ref)) {
    console.error(`Error: ref file not found: ${args.ref}`);
    process.exit(2);
  }

  let viewports;
  try {
    viewports = parseViewports(args.viewports);
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(2);
  }

  fs.mkdirSync(args.out, { recursive: true });
  const fileUrl = pathToFileURL(path.resolve(args.html)).href;
  const axeSource = await getAxeSource();
  const started = Date.now();

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.error(`Error launching chromium: ${e.message}`);
    process.exit(2);
  }

  const results = [];
  try {
    for (const vp of viewports) {
      const r = await renderViewport(browser, fileUrl, vp, args.out, axeSource);
      if (args.ref) {
        const diffPath = path.join(args.out, `diff-${vp.label}.png`);
        try {
          r.refDiff = diffAgainstRef(r.screenshot, args.ref, diffPath, args.diffThreshold);
          if (!r.refDiff.passed) {
            r.passed = false;
            r.failures.push(`ref diff ${r.refDiff.diffScore.toFixed(4)} > ${args.diffThreshold}`);
          }
        } catch (e) {
          r.refDiff = { error: e.message, passed: false };
          r.passed = false;
          r.failures.push(`ref diff error: ${e.message}`);
        }
      }
      results.push(r);
    }
  } finally {
    await browser.close();
  }

  const elapsedMs = Date.now() - started;
  const overallPass = results.every((r) => r.passed);
  const report = {
    schemaVersion: 1,
    html: path.resolve(args.html),
    generatedAt: new Date().toISOString(),
    elapsedMs,
    axeAvailable: !!axeSource,
    refMode: !!args.ref,
    overall: { passed: overallPass, viewports: results.length },
    viewports: results,
  };

  const reportPath = path.join(args.out, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Human summary to stderr (keeps stdout clean-ish).
  console.log(`report: ${path.resolve(reportPath)}`);
  for (const r of results) {
    console.log(`  ${r.viewport}: ${r.passed ? 'PASS' : 'FAIL'}${r.failures.length ? ' — ' + r.failures.join(', ') : ''}`);
  }
  console.log(`overall: ${overallPass ? 'PASS' : 'FAIL'} (${elapsedMs}ms)`);

  process.exit(overallPass ? 0 : 1);
}

main().catch((e) => {
  console.error(`Fatal: ${e.stack || e.message}`);
  process.exit(2);
});
