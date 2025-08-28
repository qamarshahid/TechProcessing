#!/bin/bash

# Script to create secrets in Google Secret Manager for TechProcessing backend
echo "🔐 Setting up secrets in Google Secret Manager..."

PROJECT_ID="techprocessing"

# Function to create or update a secret
create_or_update_secret() {
    local secret_name=$1
    local secret_value=$2
    
    echo "Creating/updating secret: ${secret_name}"
    
    # Check if secret exists
    if gcloud secrets describe "${secret_name}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
        echo "Secret ${secret_name} exists, adding new version..."
        echo -n "${secret_value}" | gcloud secrets versions add "${secret_name}" --data-file=- --project="${PROJECT_ID}"
    else
        echo "Creating new secret: ${secret_name}"
        echo -n "${secret_value}" | gcloud secrets create "${secret_name}" --data-file=- --project="${PROJECT_ID}"
    fi
}

# Prompt for database password
echo "📝 Please enter your Cloud SQL database password for user 'techprocessing-user':"
read -s DB_PASSWORD

# Generate a secure JWT secret (32+ characters)
JWT_SECRET=$(openssl rand -base64 32)
echo "🔑 Generated JWT secret: ${JWT_SECRET}"

# Create the secrets
create_or_update_secret "db-password" "${DB_PASSWORD}"
create_or_update_secret "jwt-secret" "${JWT_SECRET}"

echo "✅ Secrets created successfully!"

# Grant Cloud Run service access to the secrets
echo "🔒 Granting Cloud Run access to secrets..."

# Get the Cloud Run service account
SERVICE_ACCOUNT=$(gcloud run services describe techprocessing-backend \
    --region=northamerica-northeast2 \
    --project="${PROJECT_ID}" \
    --format="value(spec.template.spec.serviceAccountName)" 2>/dev/null)

if [ -z "$SERVICE_ACCOUNT" ]; then
    # Use the default Compute Engine service account
    SERVICE_ACCOUNT="${PROJECT_ID}-compute@developer.gserviceaccount.com"
    echo "Using default service account: ${SERVICE_ACCOUNT}"
else
    echo "Using existing service account: ${SERVICE_ACCOUNT}"
fi

# Grant secret accessor role
gcloud secrets add-iam-policy-binding "db-password" \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor" \
    --project="${PROJECT_ID}"

gcloud secrets add-iam-policy-binding "jwt-secret" \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="roles/secretmanager.secretAccessor" \
    --project="${PROJECT_ID}"

echo "🎉 Setup complete! Your secrets are now securely stored in Google Secret Manager."
echo "📋 Summary:"
echo "  - Secret 'db-password': Database password for techprocessing-user"
echo "  - Secret 'jwt-secret': JWT signing secret"
echo ""
echo "🚀 You can now deploy your Cloud Run service with:"
echo "  gcloud run services replace cloud-run-service.yaml --region=northamerica-northeast2 --project=${PROJECT_ID}"
