#!/bin/bash

# Deploy the backend to Google Cloud Run
echo "🚀 Deploying backend to Google Cloud Run..."

# Build and deploy using gcloud
gcloud run deploy techprocessing \
  --source . \
  --region northamerica-northeast2 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 4 \
  --timeout 60s \
  --set-env-vars NODE_ENV=production,CORS_ORIGIN=https://qamarshahid.github.io,CORS_ORIGINS=https://qamarshahid.github.io

echo "✅ Deployment completed!"
echo "🔗 Backend URL: https://techprocessing-backend-320817886283.northamerica-northeast2.run.app"
