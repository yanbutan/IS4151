import serial
import time 

print("Listening on COM Port 5... Press CTRL+C to exit")

try:
    ser = serial.Serial(port='COM5', baudrate=115200, timeout=1)
    # Read newline terminated data
    while True:
        msg = ser.readline()
        smsg = msg.decode('utf-8').strip()
        if len(smsg) > 0:
            print('RX:{}'.format(smsg))
            line = input("")
            res = line + "\r\n"
            # Write newline terminated data
            ser.write(res.encode())
        time.sleep(1)

except KeyboardInterrupt:
	if ser.is_open:
		ser.close()
	print("Program terminated!") 
