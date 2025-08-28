# 🚀 GitHub Actions Deployment Setup

This repository uses GitHub Actions to automatically deploy:
- **Frontend** → GitHub Pages
- **Backend** → Google Cloud Platform (Cloud Run)

## 📋 Required GitHub Secrets

To enable automatic deployments, you need to configure the following secrets in your GitHub repository:

### Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 🔐 Google Cloud Platform Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GCP_PROJECT_ID` | Your GCP Project ID | `techprocessing-prod` |
| `GCP_REGION` | GCP deployment region | `northamerica-northeast2` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Workload Identity Provider | `projects/123/locations/global/workloadIdentityPools/github/providers/github` |
| `GCP_SERVICE_ACCOUNT` | Service account email | `github-actions@techprocessing-prod.iam.gserviceaccount.com` |
| `ARTIFACT_REPO` | Artifact Registry repository | `techprocessing-repo` |
| `CLOUD_RUN_SERVICE` | Cloud Run service name | `techprocessing-api` |
| `CLOUD_SQL_INSTANCE` | Cloud SQL instance (optional) | `techprocessing-prod:region:instance` |
| `VPC_CONNECTOR` | VPC connector (optional) | `projects/PROJECT/locations/REGION/connectors/CONNECTOR` |
| `IMAGE_NAME` | Docker image name | `techprocessing-api` |
| `MIGRATIONS_JOB_NAME` | Migration job name | `techprocessing-migrations` |
| `CLOUD_RUN_SET_SECRETS_FLAGS` | Secret manager flags | `--set-secrets=DATABASE_URL=DATABASE_URL:latest` |

### 🌐 Frontend Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.run.app` |

### 🗄️ Database Secrets (Optional)

| Secret Name | Description | Default |
|-------------|-------------|---------|
| `DATABASE_SSL` | Enable SSL for database | `true` |
| `DATABASE_SSL_REJECT_UNAUTHORIZED` | SSL validation | `false` |

## 🛠️ Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository `Settings`
2. Navigate to `Pages` in the left sidebar
3. Under **Source**, select `GitHub Actions`
4. Save the changes

### 2. Configure Google Cloud Platform

#### Set up Workload Identity Federation:

```bash
# Set variables
export PROJECT_ID="your-project-id"
export POOL_NAME="github"
export PROVIDER_NAME="github"
export SERVICE_ACCOUNT_NAME="github-actions"
export REPO_OWNER="your-github-username"
export REPO_NAME="TechProcessing"

# Create Workload Identity Pool
gcloud iam workload-identity-pools create $POOL_NAME \
  --project=$PROJECT_ID \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create Workload Identity Provider
gcloud iam workload-identity-pools providers create-oidc $PROVIDER_NAME \
  --project=$PROJECT_ID \
  --location="global" \
  --workload-identity-pool=$POOL_NAME \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# Create Service Account
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
  --project=$PROJECT_ID \
  --description="Service account for GitHub Actions" \
  --display-name="GitHub Actions"

# Grant necessary roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

# Allow GitHub Actions to impersonate the service account
gcloud iam service-accounts add-iam-policy-binding \
  "$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com" \
  --project=$PROJECT_ID \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')/locations/global/workloadIdentityPools/$POOL_NAME/attribute.repository/$REPO_OWNER/$REPO_NAME"

# Get the Workload Identity Provider name for GitHub secrets
gcloud iam workload-identity-pools providers describe $PROVIDER_NAME \
  --project=$PROJECT_ID \
  --location="global" \
  --workload-identity-pool=$POOL_NAME \
  --format="value(name)"
```

### 3. Create Artifact Registry Repository

```bash
gcloud artifacts repositories create techprocessing-repo \
  --repository-format=docker \
  --location=$GCP_REGION \
  --description="Docker repository for TechProcessing"
```

### 4. Set up Cloud Run Service (if not exists)

```bash
# This will be created automatically by the workflow, but you can pre-create it:
gcloud run deploy techprocessing-api \
  --image=gcr.io/cloudrun/hello \
  --region=$GCP_REGION \
  --platform=managed \
  --allow-unauthenticated
```

## 🚀 Deployment Triggers

### Automatic Deployment

Deployments trigger automatically when you push to the `main` branch:

- **Frontend deploys** when changes are detected in:
  - `src/`, `public/`, `index.html`
  - `package.json`, `vite.config.ts`, `tailwind.config.js`

- **Backend deploys** when changes are detected in:
  - `backend/`, `Dockerfile`, `docker-compose.yml`

### Manual Deployment

You can also trigger deployments manually:

1. Go to `Actions` tab in your repository
2. Select `🚀 Production Deployment`
3. Click `Run workflow`
4. Choose which components to deploy
5. Click `Run workflow`

## 📊 Monitoring

- **Frontend**: Monitor deployments in the Actions tab and check your GitHub Pages URL
- **Backend**: Monitor Cloud Run logs in Google Cloud Console
- **Database**: Check Cloud SQL and migration job logs

## 🔧 Troubleshooting

### Common Issues:

1. **GitHub Pages not working**: Ensure Pages is enabled and set to "GitHub Actions"
2. **GCP deployment failing**: Check that all secrets are configured correctly
3. **Permission errors**: Verify Workload Identity Federation setup
4. **Build failures**: Check Node.js version compatibility

### Debug Commands:

```bash
# Check Cloud Run service
gcloud run services describe techprocessing-api --region=$GCP_REGION

# Check recent deployments
gcloud run revisions list --service=techprocessing-api --region=$GCP_REGION

# View logs
gcloud logs read --service=techprocessing-api --region=$GCP_REGION
```

## 🎯 Next Steps

1. Configure all required secrets
2. Push changes to `main` branch
3. Monitor deployment in Actions tab
4. Verify both frontend and backend are working
5. Set up monitoring and alerts in GCP Console

Happy deploying! 🚀
