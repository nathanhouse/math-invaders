import http.server
import socketserver
import webbrowser
from pathlib import Path

# Set the port
PORT = 8000

# Create handler
Handler = http.server.SimpleHTTPRequestHandler

# Set up the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    # Print message
    print(f"Server running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    
    # Open browser automatically
    webbrowser.open(f"http://localhost:{PORT}")
    
    # Start serving
    httpd.serve_forever() 