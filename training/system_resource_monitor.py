
import time
import psutil

print('Monitoring system resources. Press Ctrl+C to stop.')
print(f'{'Time':<8} {'CPU%':<6} {'RAM Used (GB)':<15} {'RAM %':<7} {'Disk Used (GB)':<15} {'Disk %':<7}')

try:
    while True:
        cpu = psutil.cpu_percent(interval=1)
        ram = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        print(f"{time.strftime('%H:%M:%S')} {cpu:<6.1f} {ram.used/1e9:<15.2f} {ram.percent:<7.1f} {disk.used/1e9:<15.2f} {disk.percent:<7.1f}")
        time.sleep(2)
except KeyboardInterrupt:
    print('Monitoring stopped.')
