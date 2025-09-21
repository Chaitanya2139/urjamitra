#!/bin/bash

echo "🛑 Stopping UrjaMitra - All Services"
echo "===================================="

# Function to kill process on port
kill_port() {
    PID=$(lsof -ti:$1)
    if [ ! -z "$PID" ]; then
        echo "🔪 Killing process on port $1 (PID: $PID)"
        kill -9 $PID
        echo "✅ Port $1 freed"
    else
        echo "ℹ️  No process running on port $1"
    fi
}

# Kill processes on specific ports
kill_port 5001  # Carbon Footprint API
kill_port 5002  # Solar System API
kill_port 3000  # React Frontend

# Also kill any python processes related to our APIs
echo ""
echo "🔍 Cleaning up any remaining API processes..."
pkill -f "api_server.py" 2>/dev/null && echo "✅ Killed api_server.py processes"
pkill -f "solar_api_server.py" 2>/dev/null && echo "✅ Killed solar_api_server.py processes"

# Kill any npm/node processes from our project
echo ""
echo "🔍 Cleaning up frontend processes..."
pkill -f "react-scripts" 2>/dev/null && echo "✅ Killed react-scripts processes"

echo ""
echo "✅ All UrjaMitra services stopped!"