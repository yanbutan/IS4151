import serial

ser = serial.Serial(port='COM5', baudrate=115200)
# Read newline terminated data
print('Code is Running')
msg = ser.readline()
smsg = msg.decode('utf-8').strip()
print('RX:{}'.format(smsg))
line = input("")
res = line + "\r\n"
# Write newline terminated data
ser.write(res.encode())
