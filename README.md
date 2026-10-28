# demo-nx

An Nx monorepo on [Pipemesh](https://pipemesh.io): five services (`apps/`)
and three shared libraries (`libs/`), TypeScript, bundled with esbuild and
tested with Node's built-in test runner.

**What the pipeline does:**

- **Dispatch by Nx's own inputs.** The `graph` job fingerprints each
  service from the files Nx counts as inputs of its `build` and `test`
  targets (`nx show target inputs`), including the libraries it depends on
  (the `nx/fingerprint@1` component).
- **One pipeline per service.** Each service has its own pipeline, and
  receives a revision only when its fingerprint changed since it was last
  dispatched. A service that sat out ten commits sees all ten when the next
  one changes it.
- **Deploy only a new bundle.** A service's deploys run when the bundle
  they ship is new to them. esbuild output is byte-reproducible and drops
  comments, so a comment or a test change builds and stops there.

- **Test reports.** Every project's `test` script also writes its results
  as Markdown (`tools/markdown-reporter.mjs`, a `node:test` reporter), and
  each service's build shows its own in the job panel's Reports tab,
  passing or failing. Nx keeps the report with a cached test run.
- **No CI image to maintain.** Jobs run on `node:24-bookworm` (pinned by
  digest) and keep npm's download cache in a Pipemesh cache keyed on
  `package-lock.json`.

Measured on pipemesh.io (revisions 5–9):

| Change | Services dispatched | Deploys |
|---|---|---|
| README | none | none |
| Comment in `libs/money` | orders, payments, catalog | none (identical bundles) |
| Test-only change in `apps/orders` | orders | none (identical bundle) |
| Code change in `libs/money` | orders, payments, catalog | those three |
| Service pipeline config (`.pipemesh/service.yaml`) | all five | none (identical bundles) |
| `deploy/` script | all five | all five |

Pull requests run `nx run-many -t test build` on Nx Cloud's cache, read-only:
what the change leaves alone is a cache hit.

**Run it locally:**

```sh
npm ci
npx nx run-many -t test build
npx nx show target inputs @demo/orders:build   # what the orders fingerprint hashes
```

See the pipeline at https://pipemesh.io/github.com/pipemesh/demo-nx.
