from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

def test_http():
    print("Testing HTTPServer...")
    try:
        server_address = ('127.0.0.1', 8081)
        httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
        print("Server created successfully on 127.0.0.1:8081")
        print("Closing server...")
        httpd.server_close()
        print("Server closed successful.")
    except Exception as e:
        print(f"HTTP Server error: {e}")

if __name__ == "__main__":
    test_http()
