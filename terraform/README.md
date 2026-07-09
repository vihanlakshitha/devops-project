# Terraform — GCP foundation

Codifies the GCP resources the CD pipeline depends on: enabled APIs, the Artifact
Registry repo, the `github-actions-deployer` service account and its roles, and
the Workload Identity Federation pool/provider/binding that lets GitHub Actions
authenticate without a static key.

It does **not** manage the Cloud Run services themselves — those are created and
updated by `.github/workflows/cd.yml` on every deploy, since they change on every
push (new image, new revision).

## Usage

```bash
cd terraform
terraform init
terraform plan     # should show "No changes" if nothing has drifted
terraform apply    # only needed if you change main.tf
```

State is kept locally (`terraform.tfstate`, gitignored) for this practice
project. In a team setting this would live in a remote backend (e.g. a GCS
bucket) so everyone plans against the same state.

## Resources managed

| Resource | Purpose |
|---|---|
| `google_project_service.apis` | Enables Cloud Run, Artifact Registry, Cloud Build, IAM Credentials APIs |
| `google_artifact_registry_repository.devops_project` | Docker image storage |
| `google_service_account.github_actions_deployer` | Identity GitHub Actions assumes to deploy |
| `google_project_iam_member.*` | Grants that identity `run.admin`, `artifactregistry.writer`, `iam.serviceAccountUser` |
| `google_iam_workload_identity_pool.github_pool` | Trust boundary for external (GitHub) identities |
| `google_iam_workload_identity_pool_provider.github_provider` | Verifies GitHub's OIDC tokens, scoped to this repo owner |
| `google_service_account_iam_member.github_wif_binding` | Restricts impersonation to `vihanlakshitha/devops-project` specifically |
