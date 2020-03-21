import serial
import time


def run():
    print("Listening on COM Port 3... Press CTRL+C to exit")
    state = 0
    not_empty_counter = 0
    current_player = 0
    rows, cols = (0, 0)
    board = [[0 for i in range(cols)] for j in range(rows)]
    try:
        ser = serial.Serial(port="COM3", baudrate=115200, timeout=1)
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
                    if "chosen" in smsg:
                        x_cor = int(smsg.split(":")[1])
                        y_cor = int(smsg.split(":")[2])
                        # Checks that the grid is empty first
                        if check_empty(x_cor, y_cor, board):
                            mark = ""
                            if current_player == 1 or current_player == 0:
                                current_player = 2
                                mark = "X"
                            elif current_player == 2:
                                current_player = 1
                                mark = "O"
                            board[x_cor][y_cor] = mark
                            next_player(ser,board,current_player)
                        else:
                            not_empty_counter += 1
                            grid_not_empty(ser,not_empty_counter)
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


def grid_not_empty(ser,counter):
    print("Grid is filled. Please choose another one")
    res = "notempty"+str(counter)+"\r\n"
    ser.write(res.encode())

def next_player(ser,board,player):
    print("Player " + str(player) + "'s Turn")
    res = "next"+str(player)+ "\r\n"
    ser.write(res.encode())
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

