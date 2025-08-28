#!/bin/bash

# Deploy to Cloud Run with proper CORS configuration
echo "🚀 Deploying backend to Cloud Run with CORS configuration..."

# Set project ID
PROJECT_ID="techprocessing"
SERVICE_NAME="techprocessing-backend"
REGION="northamerica-northeast2"
IMAGE="gcr.io/${PROJECT_ID}/techprocessing:latest"

echo "📦 Building and pushing Docker image..."
# Build and push the image
docker build -t ${IMAGE} .
docker push ${IMAGE}

echo "🌐 Deploying Cloud Run service..."
# Deploy using the YAML configuration
gcloud run services replace cloud-run-service.yaml \
  --region=${REGION} \
  --project=${PROJECT_ID}

echo "🔐 Setting IAM permissions..."
# Allow unauthenticated access
gcloud run services set-iam-policy-binding ${SERVICE_NAME} \
  --region=${REGION} \
  --member="allUsers" \
  --role="roles/run.invoker"

echo "🔗 Getting service URL..."
# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} \
  --format="value(status.url)")

echo "✅ Deployment completed!"
echo "🔗 Service URL: ${SERVICE_URL}"
echo "🔗 API URL: ${SERVICE_URL}/api"
echo ""
echo "📝 Update your frontend .env.production file with:"
echo "VITE_API_URL=${SERVICE_URL}/api"
echo ""
echo "🧪 Test the deployment:"
echo "curl -H \"Origin: https://qamarshahid.github.io\" ${SERVICE_URL}/api/health"
