from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

os.chdir(Path(__file__).resolve().parent)
server = ThreadingHTTPServer(("127.0.0.1", 8080), SimpleHTTPRequestHandler)
print("Audio Studio at http://localhost:8080", flush=True)
server.serve_forever()
