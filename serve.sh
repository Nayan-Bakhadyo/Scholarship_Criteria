#!/bin/bash

# UCO Foundation Scholarship Portal Deployment Script

echo "UCO Foundation Scholarship Portal - Local Server"
echo "==============================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "Error: index.html not found. Please run this script from the website root directory."
    exit 1
fi

# Check if JSON files exist
if [ ! -d "scholarship_json_files" ]; then
    echo "Error: scholarship_json_files directory not found."
    echo "Please ensure the JSON files are in the correct location."
    exit 1
fi

# Count JSON files
json_count=$(find scholarship_json_files -name "*.json" | wc -l)
echo "Found $json_count scholarship JSON files"

# Check for Python
if command -v python3 &> /dev/null; then
    echo "Starting local server on http://localhost:8000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Open browser (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8000
    fi
    
    # Start Python server
    python3 -m http.server 8000
    
elif command -v python &> /dev/null; then
    echo "Starting local server on http://localhost:8000"
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Open browser (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8000
    fi
    
    # Start Python server
    python -m SimpleHTTPServer 8000
    
else
    echo "Python not found. Please install Python to run the local server."
    echo "Alternatively, you can use any other web server to serve the files."
    exit 1
fi
