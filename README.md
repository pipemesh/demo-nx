# demo-nx

An Nx monorepo on [PipeMesh](https://pipemesh.dev): five services (`apps/`)
and three shared libraries (`libs/`), TypeScript, bundled with esbuild and
tested with Node's built-in test runner.

**What the pipeline does:**

- **Dispatch by Nx's own inputs.** The `graph` job fingerprints each
  service from the files Nx counts as inputs of its `build` and `test`
  targets (`nx show target inputs`), including the libraries it depends on
  (`tools/fingerprint.mjs`).
- **One pipeline per service.** Each service has its own pipeline, and
  receives a revision only when its fingerprint changed since it was last
  dispatched. A service that sat out ten commits sees all ten when the next
  one changes it.
- **Deploy only a new bundle.** A service's deploys run when the bundle
  they ship is new to them. esbuild output is byte-reproducible and drops
  comments, so a comment or a test change builds and stops there.

| Change | Services dispatched | Deploys |
|---|---|---|
| README | none | none |
| Comment in `libs/money` | orders, payments, catalog | none (identical bundles) |
| Test-only change in `apps/orders` | orders | none (identical bundle) |
| Code change in `libs/money` | orders, payments, catalog | those three |
| `deploy/` script | all five | all five |

Pull requests run `nx affected -t test build` against the merge base.

**Run it locally:**

```sh
npm ci
npx nx run-many -t test build
node tools/fingerprint.mjs   # writes fingerprints/<service>
```
