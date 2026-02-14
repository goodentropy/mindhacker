#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
STACK_NAME="${STACK_NAME:-mindhacker}"
AWS_REGION="${AWS_REGION:-us-east-1}"

echo "=== MindHacker Deployment ==="
echo "Stack: $STACK_NAME | Region: $AWS_REGION"
echo ""

# Step 1: Build frontend
echo "[1/4] Building Next.js frontend..."
cd "$PROJECT_ROOT/frontend"
npm ci --silent
npm run build
echo "  Frontend built to out/"

# Step 2: Prepare Lambda layer
echo "[2/4] Preparing Lambda layer..."
LAYER_DIR="$PROJECT_ROOT/backend/layers/shared-deps/python"
mkdir -p "$LAYER_DIR"
pip install -r "$PROJECT_ROOT/backend/requirements.txt" -t "$LAYER_DIR" --quiet
echo "  Layer dependencies installed"

# Step 3: SAM build & deploy
echo "[3/4] Building and deploying SAM stack..."
cd "$PROJECT_ROOT/infrastructure"
sam build --template-file template.yaml
sam deploy \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --capabilities CAPABILITY_NAMED_IAM \
  --resolve-s3 \
  --no-confirm-changeset \
  --no-fail-on-empty-changeset

# Step 4: Upload frontend to S3
echo "[4/4] Uploading frontend to S3..."
FRONTEND_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text 2>/dev/null || echo "")

if [ -n "$FRONTEND_BUCKET" ] && [ "$FRONTEND_BUCKET" != "None" ]; then
  aws s3 sync "$PROJECT_ROOT/frontend/out" "s3://$FRONTEND_BUCKET" --delete --quiet
  echo "  Frontend uploaded to $FRONTEND_BUCKET"
else
  echo "  Warning: Could not find FrontendBucket output. Upload frontend manually."
fi

# Print outputs
echo ""
echo "=== Deployment Complete ==="
API_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text 2>/dev/null || echo "Not available")
CF_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontUrl'].OutputValue" \
  --output text 2>/dev/null || echo "Not available")

echo "API URL:       $API_URL"
echo "Frontend URL:  $CF_URL"
echo ""
echo "Set NEXT_PUBLIC_API_URL=$API_URL in frontend/.env.local for local dev"
