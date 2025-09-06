#!/bin/bash

# 🔐 Google Cloud Secret Manager Setup Script
# This script helps you securely store your Google Places API key

echo "🔐 Setting up Google Cloud Secret Manager for API key security..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK not found. Please install it first:"
    echo "   curl https://sdk.cloud.google.com | bash"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔑 Please authenticate with Google Cloud:"
    gcloud auth login
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "📋 Please set your Google Cloud project:"
    read -p "Enter your project ID: " PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

echo "📁 Using project: $PROJECT_ID"

# Enable Secret Manager API
echo "🔧 Enabling Secret Manager API..."
gcloud services enable secretmanager.googleapis.com

# Create service account for the application
echo "👤 Creating service account..."
SERVICE_ACCOUNT_NAME="places-api-service"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"

gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name="Places API Service Account" \
    --description="Service account for accessing Google Places API key from Secret Manager" \
    --quiet 2>/dev/null || echo "Service account already exists"

# Create the secret
echo "🔐 Creating secret for Google Places API key..."
read -s -p "Enter your Google Places API key: " API_KEY
echo

echo "$API_KEY" | gcloud secrets create google-places-api-key \
    --data-file=- \
    --replication-policy="automatic" \
    --quiet 2>/dev/null || echo "Secret already exists"

# Grant access to the service account
echo "🔑 Granting access to service account..."
gcloud secrets add-iam-policy-binding google-places-api-key \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet

# Create and download service account key
echo "📄 Creating service account key..."
gcloud iam service-accounts keys create ./service-account-key.json \
    --iam-account=$SERVICE_ACCOUNT_EMAIL \
    --quiet

echo "✅ Secret Manager setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add this to your .env file:"
echo "   GCP_PROJECT_ID=$PROJECT_ID"
echo "   GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json"
echo ""
echo "2. Add service-account-key.json to your .gitignore"
echo "3. Deploy the service account key to your production environment"
echo ""
echo "🔒 Your API key is now securely stored in Google Cloud Secret Manager!"
echo "   - API key is encrypted at rest"
echo "   - Access is controlled by IAM"
echo "   - Audit logs track all access"
echo "   - Can be rotated without code changes"
