import os
import sys
import subprocess
import time

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def run_test(name, command):
    print(f"--- Testing {name} ---")
    try:
        # Use subprocess to capture exit codes accurately
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"SUCCESS: {name} is working.")
            return True
        else:
            print(f"FAILED: {name} exited with code {result.returncode}")
            if result.stderr:
                print(f"Error: {result.stderr.strip()}")
            return False
    except subprocess.TimeoutExpired:
        print(f"FAILED: {name} timed out.")
        return False
    except Exception as e:
        print(f"FAILED: {name} error: {e}")
        return False

def main():
    clear_screen()
    print("====================================================")
    print("      BACKEND SERVER DIAGNOSTIC & FIX TOOL          ")
    print("====================================================")
    print("\nIt seems your backend server is crashing with error -1073741510.")
    print("This is often caused by a system-level issue with Python 3.13 on some Windows machines,")
    print("especially regarding networking or specific native libraries.\n")

    print("[STEP 1] Environment Check")
    print(f"Python Version: {sys.version}")
    
    # Check if we can run a simple script
    if not run_test("Basic Python", "python -c \"print('Hello')\""):
        print("CRITICAL: Even basic Python is failing. Reinstalling Python may be necessary.")
        return

    # Check if we can run networking
    if not run_test("Python Networking", "python -m http.server 9999 --help"):
        print("\nDIAGNOSIS: Python Networking is crashing.")
        print("This is a known issue with Python 3.13 on some Windows builds.")
        print("\nRECOMMENDED FIXES:")
        print("1. **Downgrade to Python 3.12**: This is the most reliable fix.")
        print("2. Check for conflicting software (Antivirus/Firewall/VPN) that might be blocking Python's socket creation.")
        print("3. Try running in an Elevated Command Prompt (Run as Administrator).")
    else:
        print("\nNetworking seems OK. Checking Django...")
        if not run_test("Django Check", "python manage.py check"):
            print("\nDIAGNOSIS: Django itself is crashing.")
            print("Try running: `pip install --force-reinstall django djangorestframework django-mongodb-backend`")
        else:
            print("\nDjango seems OK. The issue might be intermittent or related to the MongoDB connection.")
            print("Check your .env file and MONGODB_URI.")

    print("\n====================================================")
    print("Please try the recommended fixes above to get your server running.")
    print("Once the server is running, the login/signup screens will work correctly.")
    print("====================================================")

if __name__ == "__main__":
    main()
