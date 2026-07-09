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

output "db_instance_connection_name" {
  description = "Cloud SQL connection name, used as --add-cloudsql-instances and the /cloudsql/ socket path in cd.yml"
  value       = google_sql_database_instance.db.connection_name
}

output "db_password_secret_id" {
  description = "Secret Manager secret ID holding the DB password, used in cd.yml's --set-secrets flag"
  value       = google_secret_manager_secret.db_password.secret_id
}

output "backend_runtime_service_account_email" {
  description = "Service account Cloud Run should run the backend as, used in cd.yml's --service-account flag"
  value       = google_service_account.backend_runtime.email
}
