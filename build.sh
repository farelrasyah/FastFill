#!/bin/bash

# FastFill AI Extension - Build Script
# Replaces placeholder API key with actual key for production build

echo "🔨 FastFill AI Extension Build Script"
echo "======================================"

# Configuration
API_KEY_PLACEHOLDER="REPLACE_WITH_ACTUAL_API_KEY"
ACTUAL_API_KEY="AIzaSyARIKwnlrUeIxpGvTS5VhRxuR2HhWQCxoY"
CONFIG_FILE="config.js"

echo "📁 Checking config file..."
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Config file not found: $CONFIG_FILE"
    exit 1
fi

echo "🔑 Replacing API key placeholder..."
# Create backup
cp "$CONFIG_FILE" "$CONFIG_FILE.backup"

# Replace placeholder with actual API key
sed -i.tmp "s/$API_KEY_PLACEHOLDER/$ACTUAL_API_KEY/g" "$CONFIG_FILE"

# Clean up temporary file
rm -f "$CONFIG_FILE.tmp"

echo "✅ API key replaced successfully!"
echo "📦 Extension ready for distribution"
echo ""
echo "⚠️  IMPORTANT: Do not commit config.js after running this script!"
echo "   Run 'npm run build:clean' to restore placeholder before committing"
