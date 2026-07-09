# devops-project

A minimal frontend + backend app used to practice a full DevOps pipeline: containerize, push to GitHub, run CI, deploy to GCP Cloud Run via CD, and gate merges on passing checks.

## Live

| Service | URL |
|---|---|
| Backend  | https://devops-backend-252094799492.us-central1.run.app/api/message |
| Frontend | https://devops-frontend-252094799492.us-central1.run.app |

## Stack

- **Backend** — Node.js + Express (`backend/`), tested with Jest + Supertest
- **Frontend** — static HTML/CSS/JS served by nginx (`frontend/`), tested with Jest
- **Containers** — one `Dockerfile` per service, orchestrated locally with `docker-compose.yml`
- **CI/CD** — GitHub Actions (`.github/workflows/`)
- **Cloud** — Google Cloud Run + Artifact Registry, authenticated via Workload Identity Federation (no static keys)

## Project layout

```
backend/
  server.js          Express API — GET /api/health, GET /api/message
  server.test.js      Jest + Supertest tests
  Dockerfile
frontend/
  index.html
  script.js           fetches the backend message and renders it
  script.test.js       Jest tests for the fetch logic
  Dockerfile
docker-compose.yml     runs both services together locally
.github/workflows/
  ci.yml               test -> build, on every push and PR
  cd.yml                test -> build -> push -> deploy, on push to master
```

## Run it locally

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3001/api/message

Or run each service directly with Node:

```bash
cd backend && npm install && npm test && npm start
cd frontend && npm install && npm test   # static files, open index.html directly
```

## Pipeline

**CI** (`ci.yml`) — on every push and pull request: installs dependencies and runs tests for both services, then builds both Docker images to confirm they still build. Nothing is published.

**CD** (`cd.yml`) — on every push to `master`: runs the same tests, then builds and pushes both images to Artifact Registry tagged with the commit SHA, deploys the backend to Cloud Run first, patches the frontend's API URL to point at the live backend, then builds/pushes/deploys the frontend.

**Branch protection** — `master` requires a pull request and a passing `build` check (which itself depends on tests passing) before merging. Applies to admins too; direct pushes are rejected.

## Deploying to your own GCP project

1. Create a GCP project with billing enabled.
2. Enable APIs: `run`, `artifactregistry`, `cloudbuild`, `iamcredentials`.
3. Create an Artifact Registry Docker repo.
4. Create a deployer service account with `roles/run.admin`, `roles/artifactregistry.writer`, `roles/iam.serviceAccountUser`.
5. Set up a Workload Identity Federation pool + GitHub OIDC provider, scoped to your repo.
6. Update the `env` block in `cd.yml` with your project ID, region, and provider/service-account resource names.
