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
                        try:
                            current_player = int(smsg[0])
                            x_cor = int(smsg.split(":")[1])
                            y_cor = int(smsg.split(":")[2])
                            # Checks that the grid is empty first
                            if check_empty(x_cor, y_cor, board):
                                mark = ""
                                if current_player == 1:
                                    mark = "X"
                                elif current_player == 2:
                                    mark = "O"
                                board[x_cor][y_cor] = mark
                                if check_winner(board,mark,rows):
                                    n_in_row(ser,board,current_player)
                                    board = [["_" for i in range(cols)] for j in range(rows)]
                                    state = 2
                                elif check_board_full(ser,board):
                                    print("Board is full! It's a draw!")
                                    ser.write(b"full\r\n")
                                    state = 2
                                else: 
                                    next_player(ser,board,current_player)
                            else:
                                grid_not_empty(ser,not_empty_counter)
                        except IndexError:
                            out_of_bounds(ser,board)
                    elif "endSerie" in smsg:
                        print("Series Ended!!")
                        state = 0
                    elif "endgame" in smsg:
                        print("Game Ended!!")
                        state = 2
            time.sleep(1)

    except KeyboardInterrupt:
        if ser.is_open:
            ser.close()
        print("Program terminated!")

def check_winner(board,mark,size):
    win = False
    rcounter = 0
    lcounter = size-1
    for row in board:
        if all(elem == mark for elem in row):
            win = True
            break
    
    #check columns
    for y in range(size):
        for x in range(size):
            if board[x][y] == mark and x == size-1:
                win = True
            elif board[x][y] == mark:
                continue
            else:
                break
    
    #checks right diagonal
    for row in board:
        if row[rcounter] == mark and size == rcounter+1:
            win = True
        elif row[rcounter] == mark:
            rcounter += 1
            continue
        else: 
            break
    
    #checks left diagonal
    for row in board:
        if row[lcounter] == mark and size == size-lcounter:
            win = True
        elif row[lcounter] == mark:
            lcounter -= 1
            continue
        else: 
            break

    return win

def n_in_row(ser,board,player):
    print("Woop! We have a winner!Player : " + str(player))
    res = str(player)+"ninrow\r\n"
    ser.write(res.encode())
    for row in board:
        print(row)

def check_board_full(ser,board):
    full = True
    for row in board:
        if "_" in row:
            full = False
            break
    return full

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
    if "_" in board[x][y]:
        return True
    else:
        return False

def out_of_bounds(ser,board):
    print("Index is out of bounds. Please choose another grid!")
    ser.write(b"outside\r\n")

def grid_not_empty(ser,counter):
    print("Grid is filled. Please choose another one")
    res = "notempty\r\n"
    ser.write(res.encode())

def next_player(ser,board,player):
    if player == 2:
        next_player = 1 
    else:
        next_player = 2
    res = "next"+str(player+1)+ "\r\n"
    ser.write(res.encode())
    for row in board:
        print(row)
    print("Player " + str(next_player) + "'s Turn")

if __name__ == "__main__":
    run()

# States
# 0 : Initial Request To Play Game
# 1 : Starting of a new serie
# 2 : Starting of new game
# 3 : Game Initiatin Done
# 4 : Board Size Chosen

