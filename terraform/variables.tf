variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "project-61969037-62f2-4a50-8c5"
}

variable "region" {
  description = "GCP region for Artifact Registry and Cloud Run"
  type        = string
  default     = "us-central1"
}

variable "github_repository" {
  description = "GitHub repo (owner/name) allowed to impersonate the deployer service account"
  type        = string
  default     = "vihanlakshitha/devops-project"
}
