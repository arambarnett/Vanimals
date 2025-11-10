#!/bin/bash

# Start backend server and ngrok for testing on physical devices
# Usage: ./start-with-ngrok.sh

echo "🚀 Starting Sprouts Backend with ngrok..."
echo ""

# Start the backend server in the background
echo "📦 Starting backend server on port 3000..."
npm run dev &
BACKEND_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to initialize..."
sleep 5

# Start ngrok
echo "🌐 Starting ngrok tunnel..."
ngrok http 3000 &
NGROK_PID=$!

echo ""
echo "✅ Backend is running!"
echo ""
echo "📱 Get your ngrok URL:"
echo "   Open: http://localhost:4040"
echo "   Or run: curl http://localhost:4040/api/tunnels"
echo ""
echo "🔧 Update Flutter app with ngrok URL:"
echo "   File: sprouts_flutter/lib/core/constants/app_constants.dart"
echo "   Change baseUrl to your ngrok URL"
echo ""
echo "🛑 To stop both services, press Ctrl+C"
echo ""

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $BACKEND_PID $NGROK_PID; exit" INT

# Keep script running
wait
