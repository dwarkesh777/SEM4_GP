import socket
import sys

def test_socket():
    print("Creating socket...")
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        print("Socket created.")
        
        # Try to bind to a local port
        print("Binding to localhost:8001...")
        s.bind(('127.0.0.1', 8001))
        print("Bind successful.")
        
        print("Listening...")
        s.listen(1)
        print("Listening successful.")
        
        s.close()
        print("Socket closed successfully.")
    except Exception as e:
        print(f"Socket error: {e}")

if __name__ == "__main__":
    print(f"Python version: {sys.version}")
    test_socket()
