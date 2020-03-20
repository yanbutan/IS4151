import serial
import time


def run():
    print("Listening on COM Port 5... Press CTRL+C to exit")
    state = 0
    current_player = 0
    rows, cols = (0, 0)
    board = [[0 for i in range(cols)] for j in range(rows)]
    try:
        ser = serial.Serial(port="COM4", baudrate=115200, timeout=1)
        # Read newline terminated data
        while True:
            msg = ser.readline()
            smsg = msg.decode("utf-8")
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
                        start_serie(ser)
                        state = 2
                if state == 2:
                    if "Start Game" in smsg:
                        start_game(ser)
                        state = 3
                if state == 3:
                    if "size" in smsg:
                        print("Game Board Size Chose " + smsg.split(":")[1])
                        num = int(smsg.split(":")[1])
                        rows, cols = (num, num)
                        board = [["_" for i in range(cols)] for j in range(rows)]
                        show_game_board(ser, board)
                        state = 4
                if state == 4:
                    if "p1coor" in smsg or "p2coor" in smsg:
                        print("In the choosing crid method")
                        x_cor = 0
                        y_cor = 0
                        try:
                            x_cor = int(smsg.split(":")[1][0])
                        except ValueError:
                            x_cor = 0

                        try:
                            y_cor = int(smsg.split(":")[1][1])
                        except ValueError:
                            y_cor = 0

                        # Checks that the grid is empty first
                        if check_empty(x_cor, y_cor, board):
                            mark = ""
                            if "p1coor" in smsg:
                                current_player = 1
                                # check n in a row
                                board[x_cor][y_cor] = "X"
                                p2_turn(ser, board)
                            elif "p2coor" in smsg:
                                current_player = 2
                                # check n in a row
                                board[x_cor][y_cor] = "O"
                                p1_turn(ser, board)

                        else:
                            grid_not_empty(ser)
            time.sleep(1)

    except KeyboardInterrupt:
        if ser.is_open:
            ser.close()
        print("Program terminated!")


def start_serie(ser):
    res = "serie\r\n"
    ser.write(res.encode())
    print(
        "Serie Started!!! Any player can press 'A' on the game controller to start the first game"
    )


def start_game(ser):
    res = "game\r\n"
    ser.write(res.encode())
    print("Game Started!! Choose a board size from 3 to 10 !!")
    print("Press 'A' to toggle the size and 'B' to select!!")


def show_game_board(ser, board):
    ser.write(b"board\r\n")
    for row in board:
        print(row)


def check_empty(x, y, board):
    f"Checking if ({x},{y}) is empty"
    if "_" in board[x][y]:
        return True
    else:
        return False


def grid_not_empty(ser):
    ser.write(b"notempty\r\n")
    print("Grid is filled. Please choose another one")


def p2_turn(ser, board):
    ser.write("P2Turn\r".encode())
    print("P2's Turn")
    for row in board:
        print(row)


def p1_turn(ser, board):
    ser.write("P1Turn\r".encode())
    print("P1's Turn")
    for row in board:
        print(row)


if __name__ == "__main__":
    run()

# States
# 0 : Initial Request To Play Game
# 1 : Starting of a new serie
# 2 : Starting of new game
# 3 : Game Initiatin Done
# 4 : Board Size Chosen

