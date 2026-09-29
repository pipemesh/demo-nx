#!/usr/bin/env bash
# A puppet deploy: ships the service's bundle "to" an environment and
# smoke-tests it. Swap for your real rollout.
set -eu
svc=$1; env=$2
bundle=dist/$svc.js
[ -f "$bundle" ] || { echo "missing $bundle: the build job's artifact did not arrive" >&2; exit 1; }
echo "deploying $svc to $env: $(sha256sum "$bundle" | cut -c1-12)"
node "$bundle"
echo "$svc is live in $env"
