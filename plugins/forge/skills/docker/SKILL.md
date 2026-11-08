---
disable-model-invocation: true  # skl: on-demand pack skill
name: docker
description: Docker and Docker Compose reference - multi-stage Dockerfiles for Rust, Go and Python, layer caching, image hardening, Compose for local dev, networking, volumes, secrets, health checks, and debugging. Use when writing or reviewing a Dockerfile, .dockerignore, compose.yaml/docker-compose.yml, containerizing a service, or debugging container builds, networking or volumes.
---

# Docker

Reference patterns for images and Compose. Scope follows forge:ponytail: a single-service tool
needs a Dockerfile, not an orchestration stack. Compose is for local dev and small single-host
deployments.

## Before writing

- Look for an existing `Dockerfile`, `compose.yaml`/`docker-compose.yml`, `.dockerignore`, and CI
  that builds images. Extend them; don't add a parallel setup.
- Check the base image and language version the project already uses.
- Validate: `docker compose config --quiet`, `docker build .`, then run the container and hit its
  health endpoint (forge:verification).

## Dockerfile rules

- Pin base images to a specific version tag (`rust:1.83-slim-bookworm`, `python:3.12-slim`), never
  `:latest`. Pin by digest (`@sha256:...`) where reproducibility matters.
- Multi-stage: build in a full toolchain image, copy only the artifact into a minimal runtime image.
- Order for caching: copy dependency manifests first, install/fetch deps, then copy source.
- Run as a non-root user (numeric UID is portable across distros).
- `CMD`/`ENTRYPOINT` in exec form (`["/app/server"]`) so signals reach the process; the app must
  handle SIGTERM.
- One process per container. No SSH daemons, no supervisors unless unavoidable.
- No secrets in `ENV`, `ARG` or copied files - they persist in layers. Use BuildKit secret mounts
  for build-time secrets (`RUN --mount=type=secret,id=npmrc ...`) and runtime env/secrets for the rest.
- BuildKit cache mounts (`RUN --mount=type=cache,target=...`) speed up dependency fetches.
- `HEALTHCHECK` needs a tool present in the image; distroless/scratch images have no shell or
  `wget`, so use the orchestrator's probe or a tiny health subcommand of the binary.

### Rust

```dockerfile
FROM rust:1.83-slim-bookworm AS build
WORKDIR /src
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/src/target \
    cargo build --release --locked && cp target/release/app /app

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
USER 10001
COPY --from=build /app /usr/local/bin/app
ENTRYPOINT ["/usr/local/bin/app"]
```

The `cp` is needed because a cache-mounted `target/` is not part of the image layer. For a fully
static binary, build for `x86_64-unknown-linux-musl` and use `scratch` or a distroless static base.

### Go

```dockerfile
FROM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /server ./cmd/server

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /server /server
ENTRYPOINT ["/server"]
```

With `CGO_ENABLED=0` the binary is static; it needs CA certificates (included in distroless
static) for TLS.

### Python

```dockerfile
FROM python:3.12-slim AS build
WORKDIR /app
RUN python -m venv /venv
ENV PATH=/venv/bin:$PATH
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim
RUN useradd -r -u 10001 app
COPY --from=build /venv /venv
WORKDIR /app
COPY --chown=app . .
USER app
ENV PATH=/venv/bin:$PATH PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
CMD ["python", "-m", "myapp"]
```

Copying a venv only works between images with the same Python version and path. If the project
uses uv, use `uv sync --frozen` with its lockfile instead of pip.

## .dockerignore

Keep the build context small and secret-free:

```
.git
target/
.venv/
__pycache__/
node_modules/
.env
.env.*
*.log
coverage/
```

## Compose for local dev

```yaml
services:
  app:
    build: .
    ports: ["127.0.0.1:8080:8080"]
    env_file: .env                       # gitignored
    depends_on:
      db: { condition: service_healthy }
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10
volumes:
  pgdata:
```

- Services reach each other by service name (`postgres://postgres:dev@db:5432/app`), never
  `localhost`.
- `depends_on` without `condition: service_healthy` only orders start-up; it does not wait for
  readiness.
- Bind ports to `127.0.0.1` unless other machines must reach them; omit `ports` for services only
  other containers use.
- Named volumes for data; bind mounts for source code in dev. `docker-entrypoint-initdb.d` scripts
  run only when the data volume is empty.
- `compose.override.yaml` is auto-loaded for dev-only settings; use `-f compose.yaml -f compose.prod.yaml`
  explicitly for other environments.
- Separate networks only when you need isolation (e.g. db not reachable from a public-facing
  service).

## Hardening (production or untrusted workloads)

```yaml
services:
  app:
    read_only: true
    tmpfs: [/tmp]
    security_opt: ["no-new-privileges:true"]
    cap_drop: [ALL]
    pids_limit: 256
    deploy:
      resources:
        limits: { cpus: "1.0", memory: 512M }
```

- For running untrusted tools in a sandbox container: mount source read-only, copy into a tmpfs
  workspace before mutating, `network_mode: none` unless network is explicitly needed, no host
  credentials or credential directories mounted, pass arguments as arrays (never interpolate paths
  into shell strings).
- A Linux container does not validate macOS or Windows behaviour; test those natively.

## Health and config

- Expose a cheap `/health` (liveness: process is up) and, if needed, a readiness check that touches
  dependencies (database `SELECT 1`). Readiness failures return 503.
- All config via environment variables, validated at startup - fail fast with a clear message on
  a missing or malformed value.
- Log to stdout/stderr as structured lines; no log files inside the container.

## Deploy notes

- Tag images with the git SHA, not only `latest`, so rollback is "run the previous tag".
- Rolling deploys run old and new versions side by side - database migrations must be backward
  compatible (see forge:database-migrations).
- Never put real credentials in `compose.yaml`; `.env` stays out of git.

## Debugging

```bash
docker compose logs -f --tail=100 app
docker compose exec app sh              # no shell in distroless: use `docker debug` or a debug image
docker compose exec db psql -U postgres
docker compose ps && docker stats
docker compose up --build               # rebuild changed images
docker build --no-cache --progress=plain .   # see every build step
docker image history <image>            # find bloated layers
docker compose exec app getent hosts db # DNS inside the network
docker compose down                     # keep volumes
docker compose down -v                  # DESTROYS named volumes - confirm first
```

## Review checklist

- [ ] Base images pinned; multi-stage; runtime image minimal
- [ ] Manifests copied before source (cache-friendly)
- [ ] Non-root user; exec-form entrypoint; SIGTERM handled
- [ ] No secrets in layers, build args or committed compose files
- [ ] `.dockerignore` excludes `.git`, build output, `.env`
- [ ] Ports bound narrowly; healthchecks gate dependent services
