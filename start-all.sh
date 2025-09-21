#!/bin/bash

echo "🌱 Starting UrjaMitra - All Services"
echo "======================================"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check ports
echo "🔍 Checking ports..."
check_port 5001
check_port 5002
check_port 3000

echo ""
echo "🚀 Starting backend servers..."

# Start Carbon Footprint Backend (Port 5001)
echo "📊 Starting Carbon Footprint API Server..."
cd "backend/carbon-footprint"
../../.venv/bin/python api_server.py &
CARBON_PID=$!
echo "Carbon Footprint server started with PID: $CARBON_PID"

# Wait a moment
sleep 2

# Start Solar System Backend (Port 5002)
echo "☀️ Starting Solar System API Server..."
cd "../Solar System"
../../.venv/bin/python solar_api_server.py &
SOLAR_PID=$!
echo "Solar System server started with PID: $SOLAR_PID"

# Go back to root
cd "../.."

# Wait a moment for backends to start
sleep 3

# Test backend health
echo ""
echo "🩺 Testing backend health..."
echo "Testing Carbon Footprint API..."
curl -s http://localhost:5001/api/health | jq . || echo "❌ Carbon Footprint API not responding"

echo "Testing Solar System API..."
curl -s http://localhost:5002/api/health | jq . || echo "❌ Solar System API not responding"

echo ""
echo "🎨 Starting React Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ All services started successfully!"
echo "======================================"
echo "🌱 Carbon Footprint API: http://localhost:5001"
echo "☀️ Solar System API: http://localhost:5002"
echo "🎨 Frontend App: http://localhost:3000"
echo ""
echo "📋 Process IDs:"
echo "   Carbon Footprint: $CARBON_PID"
echo "   Solar System: $SOLAR_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "To stop all services, run: ./stop-all.sh"
echo "Or manually kill processes: kill $CARBON_PID $SOLAR_PID $FRONTEND_PID"