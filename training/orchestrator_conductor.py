
import subprocess
import time
import psutil
import os

# --- CONFIGURATION ---
SCRIPTS = [
    'auto_symbolic_training.py',
    'ultimate_symbolic_power_script.py',
    # Add more script filenames as needed
]
MAX_CPU = 80  # percent
MAX_RAM = 80  # percent
CHECK_INTERVAL = 5  # seconds
LOG_FILE = 'orchestrator_log.txt'

# --- LOGGING ---
def log(msg):
    print(msg)
    with open(LOG_FILE, 'a') as f:
        f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} {msg}\n")

# --- RESOURCE CHECK ---
def resources_ok():
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    return cpu < MAX_CPU and ram < MAX_RAM

def wait_for_resources():
    while not resources_ok():
        log(f"Waiting: CPU or RAM above threshold (CPU={psutil.cpu_percent()}%, RAM={psutil.virtual_memory().percent}%)")
        time.sleep(CHECK_INTERVAL)

# --- MAIN ORCHESTRATOR ---
def run_scripts():
    for script in SCRIPTS:
        if not os.path.exists(script):
            log(f"Script not found: {script}")
            continue
        log(f"Starting script: {script}")
        wait_for_resources()
        try:
            proc = subprocess.Popen(['python', script], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            while proc.poll() is None:
                if not resources_ok():
                    log(f"Resource limit exceeded. Pausing {script} (not implemented, just waiting)")
                    # In real orchestration, you could suspend/resume processes here
                    time.sleep(CHECK_INTERVAL)
                else:
                    time.sleep(CHECK_INTERVAL)
            out, err = proc.communicate()
            log(f"Script {script} finished with code {proc.returncode}")
            if out:
                log(f"Output: {out.decode(errors='ignore')[:500]}")
            if err:
                log(f"Errors: {err.decode(errors='ignore')[:500]}")
        except Exception as e:
            log(f"Error running {script}: {e}")

if __name__ == '__main__':
    run_scripts()
