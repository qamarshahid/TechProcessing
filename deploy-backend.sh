#!/bin/bash

# 🚀 Deploy Updated Backend to Google Cloud Run

echo "🚀 Deploying updated backend with Google Places API integration..."

# Set variables
PROJECT_ID="techprocessing"
SERVICE_NAME="techprocessing-backend"
REGION="northamerica-northeast2"

echo "📁 Project: $PROJECT_ID"
echo "🔧 Service: $SERVICE_NAME"
echo "🌍 Region: $REGION"

# Create service account key secret if it doesn't exist
echo "🔐 Creating service account key secret..."
gcloud secrets create service-account-key --data-file=backend/service-account-key.json --quiet 2>/dev/null || echo "Secret already exists, updating..."
gcloud secrets versions add service-account-key --data-file=backend/service-account-key.json

# Google Places API key secret already exists - no need to recreate
echo "🔐 Using existing Google Places API key secret..."

# Create SendGrid API key secret if it doesn't exist
echo "🔐 Creating SendGrid API key secret..."
if gcloud secrets describe sendgrid-api-key --quiet 2>/dev/null; then
    echo "Secret already exists, skipping..."
else
    echo "Please enter your SendGrid API key (starts with 'SG.'):"
    read -s SENDGRID_API_KEY
    echo "$SENDGRID_API_KEY" | gcloud secrets create sendgrid-api-key --data-file=-
fi

# Create Twilio secrets if they don't exist
echo "🔐 Creating Twilio secrets..."
if gcloud secrets describe twilio-account-sid --quiet 2>/dev/null; then
    echo "Twilio secrets already exist, skipping..."
else
    echo "Please enter your Twilio Account SID:"
    read -s TWILIO_ACCOUNT_SID
    echo "$TWILIO_ACCOUNT_SID" | gcloud secrets create twilio-account-sid --data-file=-

    echo "Please enter your Twilio Auth Token:"
    read -s TWILIO_AUTH_TOKEN
    echo "$TWILIO_AUTH_TOKEN" | gcloud secrets create twilio-auth-token --data-file=-

    echo "Please enter your Twilio Phone Number (e.g., +1234567890):"
    read -s TWILIO_PHONE_NUMBER
    echo "$TWILIO_PHONE_NUMBER" | gcloud secrets create twilio-phone-number --data-file=-
fi

# Build and deploy
echo "🔨 Building and deploying backend..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --max-instances 4 \
  --timeout 60s \
  --clear-base-image \
  --set-env-vars NODE_ENV=production,CORS_ORIGIN=https://www.techprocessingllc.com,FRONTEND_URL=https://www.techprocessingllc.com,DATABASE_HOST=/cloudsql/techprocessing:northamerica-northeast2:techprocessing-db,DATABASE_PORT=5432,DATABASE_NAME=techprocessing,DATABASE_USERNAME=techprocessing-user,DATABASE_SSL=false,JWT_EXPIRES_IN=24h,DEPLOYMENT_VERSION=v60,GCP_PROJECT_ID=techprocessing,EMAIL_HOST=smtp.gmail.com,EMAIL_PORT=587,EMAIL_SECURE=false,EMAIL_USER=support@techprocessingllc.com,EMAIL_RECIPIENT=support@techprocessingllc.com \
  --set-secrets DATABASE_PASSWORD=db-password:1,JWT_SECRET=jwt-secret:latest,GOOGLE_APPLICATION_CREDENTIALS=service-account-key:latest,EMAIL_PASS=email-password:latest,GOOGLE_PLACES_API_KEY=google-places-api-key:latest,SENDGRID_API_KEY=sendgrid-api-key:5,TWILIO_ACCOUNT_SID=twilio-account-sid:latest,TWILIO_AUTH_TOKEN=twilio-auth-token:latest,TWILIO_PHONE_NUMBER=twilio-phone-number:latest \
  --add-cloudsql-instances techprocessing:northamerica-northeast2:techprocessing-db

echo "✅ Deployment complete!"
echo "🔗 Service URL: https://$SERVICE_NAME-$REGION-$PROJECT_ID.a.run.app"

# Test the new endpoint
echo "🧪 Testing address endpoint..."
curl -s "https://$SERVICE_NAME-$REGION-$PROJECT_ID.a.run.app/api/address/search?q=123%20Main%20Street" | head -100

echo "🎉 Deployment and test complete!"
