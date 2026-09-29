# The image demo-nx's CI runs in: Node.js, what PipeMesh's hosted runner
# needs in a job image (bash, git, curl, tar), and the npm cache for the
# workspace's lockfile, so `npm ci` installs offline instead of downloading
# every package on every run. Rebuilt by the ci_image workflow when the
# lockfile or this file changes.
FROM node:24-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6

RUN apt-get update \
 && apt-get install -y --no-install-recommends bash ca-certificates curl git tar gzip \
 && rm -rf /var/lib/apt/lists/*

# Every npm command reads and writes this cache.
ENV npm_config_cache=/opt/npm-cache NX_DAEMON=false
# In CI, Nx Cloud uploads each run's CPU and memory metrics to a "run group"
# only its own CI integrations create; ours never exists, and every job
# spent about a minute retrying the upload on a 404 after its tasks were done.
ENV NX_CLOUD_DISABLE_METRICS_COLLECTION=true

COPY . /tmp/ws
RUN cd /tmp/ws && npm ci --no-audit --no-fund && rm -rf /tmp/ws
