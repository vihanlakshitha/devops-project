output "artifact_registry_repository" {
  description = "Full resource name of the Artifact Registry repo"
  value       = google_artifact_registry_repository.devops_project.name
}

output "deployer_service_account_email" {
  description = "Email of the service account GitHub Actions impersonates"
  value       = google_service_account.github_actions_deployer.email
}

output "workload_identity_provider" {
  description = "Full resource name to put in the CD workflow's WIF_PROVIDER env var"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}
