// Writes one file per deployable project into argv[2] (default:
// fingerprints/): a digest of every file Nx itself counts as an input of the
// project's build and test targets — its own sources, the sources of every
// library it depends on, the project and workspace config — as listed by
// `nx show target inputs`. A file outside that set (a README, a sibling's
// code) leaves the digest alone.
//
// Every project's digest also covers what Nx's inputs do not: the service
// pipeline's config and the deploy scripts, so a change to how services ship
// reaches them too.
//
// The dispatch pipeline produces these files as entries and dispatches a
// service when its entry changed since that service's last dispatch.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out = process.argv[2] ?? 'fingerprints';
const nx = (...args) => JSON.parse(execFileSync('npx', ['nx', ...args, '--json'],
  { encoding: 'utf8', env: { ...process.env, NX_DAEMON: 'false' } }));

// External packages Nx reports as one "AllExternalDependencies" input.
const lockfile = 'package-lock.json';
// What every service's pipeline depends on outside the Nx graph.
const shipping = ['.pipemesh/service.yaml', 'deploy'];

function walk(path) {
  return statSync(path).isDirectory()
    ? readdirSync(path).flatMap((f) => walk(join(path, f)))
    : [path];
}

function digest(files) {
  const h = createHash('sha256');
  for (const f of [...new Set(files)].sort()) {
    h.update(f).update('\0').update(createHash('sha256').update(readFileSync(f)).digest('hex')).update('\n');
  }
  return h.digest('hex');
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const project of nx('show', 'projects', '--with-target', 'build')) {
  const files = [...shipping.flatMap(walk)];
  for (const target of ['build', 'test']) {
    const inputs = nx('show', 'target', 'inputs', `${project}:${target}`);
    files.push(...inputs.files);
    if (inputs.external?.includes('AllExternalDependencies')) files.push(lockfile);
  }
  const name = project.replace(/^@[^/]+\//, '');
  const d = digest(files);
  writeFileSync(join(out, name), d + '\n');
  console.log(`${name} ${d.slice(0, 12)}`);
}
