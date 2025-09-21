#!/bin/bash

# Carbon Footprint Backend Startup Script
echo "🌱 Starting Carbon Footprint Analysis Backend..."

# Navigate to the backend directory
cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7 or higher."
    exit 1
fi

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Check if the sample image exists
if [ ! -f "A_bag_of_chpis.png" ]; then
    echo "⚠️  Warning: Sample image 'A_bag_of_chpis.png' not found."
    echo "   Some features may not work properly."
fi

# Set environment variables
export FLASK_APP=api_server.py
export FLASK_ENV=development

# Start the Flask server
echo "🚀 Starting Flask API server on http://localhost:5000"
echo "📡 Available endpoints:"
echo "   GET  /api/health     - Health check"
echo "   POST /api/analyze    - Analyze uploaded image"
echo "   POST /api/test       - Test with sample image"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 api_server.py