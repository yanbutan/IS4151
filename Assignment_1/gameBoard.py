import serial
import time


def run():
    print("Listening on COM Port 5... Press CTRL+C to exit")
    state = 0
    try:
        ser = serial.Serial(port="COM4", baudrate=115200, timeout=1)
        # Read newline terminated data
        while True:
            msg = ser.readline()
            smsg = msg.decode("utf-8").strip()
            if len(smsg) > 0:
                print("RX:{}".format(smsg))
                if state == 0:
                    line = input("")
                    res = line + "\r\n"
                    # Write newline terminated data
                    ser.write(res.encode())
                    if line == "Y":
                        print(
                            "Welcome To Tic Tac Toe. Click A+B on game controller to start a serie"
                        )
                        state = 1
                    else:
                        print("Oh Man What A Shame :( ")
                        raise KeyboardInterrupt
                if state == 1:
                    if "start" in smsg:
                        startSerie(ser)
                        state = 2
                if state == 2:
                    if "Start Game" in smsg:
                        startGame(ser)
                        state = 3
            time.sleep(1)

    except KeyboardInterrupt:
        if ser.is_open:
            ser.close()
        print("Program terminated!")


def startSerie(ser):
    res = "serie\r\n"
    ser.write(res.encode())
    print(
        "Serie Started!!! Any player can press 'A' on the game controller to start the first game"
    )


def startGame(ser):
    res = "game\r\n"
    ser.write(res.encode())
    print("Game Started!! Choose a board size from 3 to 10 !!")


if __name__ == "__main__":
    run()

# States
# 0 : Initial Request To Play Game
# 1 : Starting of a new serie
# 2 : Starting of new game

