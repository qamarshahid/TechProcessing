#!/bin/bash

# Set up CORS for Cloud Run service
echo "🔧 Setting up CORS for Cloud Run service..."

PROJECT_ID="techprocessing"
SERVICE_NAME="techprocessing-backend"
REGION="northamerica-northeast2"

echo "📋 Current service configuration:"
gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} \
  --format="export"

echo ""
echo "🔄 Updating service with CORS configuration..."

# Update the service with proper CORS headers using metadata annotations
gcloud run services update ${SERVICE_NAME} \
  --region=${REGION} \
  --set-env-vars="NODE_ENV=production,CORS_ORIGIN=https://qamarshahid.github.io,CORS_ORIGINS=https://qamarshahid.github.io,SKIP_DB=true" \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=4 \
  --timeout=900 \
  --allow-unauthenticated

echo "🔐 Setting up IAM policy..."
# Ensure the service allows unauthenticated access
gcloud run services set-iam-policy-binding ${SERVICE_NAME} \
  --region=${REGION} \
  --member="allUsers" \
  --role="roles/run.invoker"

echo ""
echo "📝 Service information:"
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --region=${REGION} \
  --format="value(status.url)")

echo "🔗 Service URL: ${SERVICE_URL}"
echo "🔗 API URL: ${SERVICE_URL}/api"

echo ""
echo "🧪 Testing CORS configuration..."

# Test the health endpoint with proper Origin header
echo "Testing health endpoint:"
curl -s -H "Origin: https://qamarshahid.github.io" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS \
  "${SERVICE_URL}/api/health" \
  -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "📋 Instructions:"
echo "1. Update your .env.production file with:"
echo "   VITE_API_URL=${SERVICE_URL}/api"
echo ""
echo "2. Test the CORS configuration:"
echo "   curl -H \"Origin: https://qamarshahid.github.io\" ${SERVICE_URL}/api/health"
echo ""
echo "3. If CORS still doesn't work, check the Cloud Run logs:"
echo "   gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=${SERVICE_NAME}\" --limit=10"
