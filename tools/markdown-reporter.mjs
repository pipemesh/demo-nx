// A node:test reporter that writes the run as a Markdown report: the
// verdict, a row per test and each failure's message. Every project's
// `test` script writes one to reports/tests.md beside the spec output, and
// the service pipeline's build shows the service's in its Reports tab.
export default async function* markdown(source) {
  const rows = [];
  for await (const { type, data } of source) {
    if ((type !== 'test:pass' && type !== 'test:fail') || data.details?.type === 'suite') continue;
    rows.push({
      name: data.name,
      file: (data.file ?? '').split('/').pop(),
      state: type === 'test:fail' ? 'fail' : data.skip !== undefined || data.todo !== undefined ? 'skip' : 'pass',
      ms: data.details?.duration_ms ?? 0,
      error: String(data.details?.error?.cause?.message ?? data.details?.error?.message ?? ''),
    });
  }
  const count = (s) => rows.filter((r) => r.state === s).length;
  const [passed, failed, skipped] = [count('pass'), count('fail'), count('skip')];
  const icon = { pass: '✅', fail: '❌', skip: '⏭' };
  const cell = (s) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  yield `# ${failed ? `❌ ${failed} of ${rows.length} tests failed` : `✅ ${passed} tests passed`}`
    + `${skipped ? `, ${skipped} skipped` : ''}\n\n`;
  yield '| | Test | File | Time |\n|---|---|---|---:|\n';
  for (const r of rows) yield `| ${icon[r.state]} | ${cell(r.name)} | ${r.file} | ${r.ms.toFixed(1)} ms |\n`;
  for (const r of rows.filter((r) => r.state === 'fail')) yield `\n## ❌ ${r.name}\n\n\`\`\`\n${r.error.trim()}\n\`\`\`\n`;
}
