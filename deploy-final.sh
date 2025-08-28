#!/bin/bash

# Final deployment script for Cloud Run with CORS
echo "🚀 Final Cloud Run Deployment with CORS Configuration"
echo "=================================================="

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
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 4 \
  --timeout 900 \
  --set-env-vars "NODE_ENV=production,CORS_ORIGIN=https://qamarshahid.github.io,CORS_ORIGINS=https://qamarshahid.github.io,SKIP_DB=true"

echo "🔗 Getting service information..."
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

echo ""
echo "✅ Deployment completed successfully!"
echo "=================================================="
echo "🔗 Service URL: ${SERVICE_URL}"
echo "🔗 API URL: ${SERVICE_URL}/api"
echo ""
echo "📝 Update your frontend configuration:"
echo "   VITE_API_URL=${SERVICE_URL}/api"
echo ""
echo "🧪 Test CORS configuration:"
echo "   node test-production-cors.js"
echo ""
echo "📊 Check service logs:"
echo "   gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=${SERVICE_NAME}\" --limit=5"
