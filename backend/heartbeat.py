import time
import os

log_file = "heartbeat_log.txt"
if os.path.exists(log_file):
    os.remove(log_file)

print("Starting heartbeat...")
try:
    for i in range(30):
        with open(log_file, "a") as f:
            f.write(f"Heartbeat {i} at {time.ctime()}\n")
        time.sleep(1)
except Exception as e:
    with open(log_file, "a") as f:
        f.write(f"Error: {e}\n")
except KeyboardInterrupt:
    with open(log_file, "a") as f:
        f.write("Caught KeyboardInterrupt\n")
