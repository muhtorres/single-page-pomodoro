#!/usr/bin/env bash
set -euo pipefail

# Required environment variables:
# S3_BUCKET         — name of the target S3 bucket
# CF_DISTRIBUTION_ID — CloudFront distribution ID

BUCKET="${S3_BUCKET:?Set S3_BUCKET environment variable}"
DISTRIBUTION_ID="${CF_DISTRIBUTION_ID:?Set CF_DISTRIBUTION_ID environment variable}"
REGION="${AWS_REGION:-us-east-1}"

echo "==> Building..."
npm run build

echo "==> Syncing static assets (with aggressive cache)..."
# Hashed assets can be cached for 1 year — filenames change on content change
aws s3 sync out/ "s3://$BUCKET" \
  --region "$REGION" \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html"

echo "==> Syncing HTML files (no-cache)..."
# HTML files should not be cached — users need latest routing
aws s3 sync out/ "s3://$BUCKET" \
  --region "$REGION" \
  --include "*.html" \
  --content-type "text/html" \
  --cache-control "public, max-age=0, must-revalidate"

echo "==> Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Status' \
  --output text

echo "==> Deploy complete!"
echo "    Bucket: s3://$BUCKET"
echo "    CloudFront: https://$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" --query 'Distribution.DomainName' --output text)"
