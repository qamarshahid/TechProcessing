#!/bin/bash

# Simple deployment script for Cloud Run
echo "🚀 Simple Cloud Run Deployment"
echo "=============================="

PROJECT_ID="techprocessing"
SERVICE_NAME="techprocessing-backend"
REGION="northamerica-northeast2"

echo "📦 Building Docker image..."
docker build -t gcr.io/${PROJECT_ID}/techprocessing:latest .

echo "📤 Pushing to Container Registry..."
docker push gcr.io/${PROJECT_ID}/techprocessing:latest

echo "🌐 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image gcr.io/${PROJECT_ID}/techprocessing:latest \
  --region ${REGION} \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 4 \
  --timeout 900 \
  --set-env-vars "NODE_ENV=production,CORS_ORIGIN=https://qamarshahid.github.io,CORS_ORIGINS=https://qamarshahid.github.io,SKIP_DB=true" \
  --port 8080

echo ""
echo "✅ Deployment completed!"

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

echo "🔗 Service URL: ${SERVICE_URL}"
echo "🔗 API URL: ${SERVICE_URL}/api"
echo ""
echo "📝 Update your .env.production file:"
echo "VITE_API_URL=${SERVICE_URL}/api"
echo ""
echo "🧪 Test the deployment:"
echo "curl -H \"Origin: https://qamarshahid.github.io\" ${SERVICE_URL}/api/health"
