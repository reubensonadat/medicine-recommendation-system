#!/bin/bash

# Script to test static export locally
echo "🚀 Testing Static Export Locally"
echo "=================================="

# Check if out directory exists
if [ ! -d "out" ]; then
    echo "❌ 'out' directory not found. Running build first..."
    npm run build
fi

echo "✅ Static export found in 'out' directory"
echo ""
echo "📁 Contents of out directory:"
ls -la out/

echo ""
echo "🌐 To test locally, you have several options:"
echo ""
echo "Option 1: Using Python (recommended)"
echo "  cd out && python3 -m http.server 3000"
echo ""
echo "Option 2: Using Node.js"
echo "  npx serve out -s -l 3000"
echo ""
echo "Option 3: Using any static server"
echo "  Just serve the 'out' directory with any web server"
echo ""
echo "🔗 Then visit: http://localhost:3000"
echo ""
echo "⚠️  Important: Do NOT use 'npm start' - this is for Next.js server"
echo "     Your static export should be served as static files only"