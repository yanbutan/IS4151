function promptPairing() {
    radio.setTransmitPower(7)
    radio.setGroup(8)
    radio.setTransmitSerialNumber(true)
    basic.showIcon(IconNames.Yes)
}
input.onButtonPressed(Button.A, function () {
    if (controllerState == 0) {
        // Sends Pairing Request To Devices
        radio.sendValue("ttt", 0)
    } else if (controllerState == 1) {
        // Sends Pairing Request To Laptop
        serial.writeLine("Care for a game of Tic Tac Toe?Y/N")
    } else if (controllerState == 3) {
        // Tells Game Board That A Game Has Been Started
        serial.writeLine("A Pressed. Start Game.")
    } else if (controllerState == 4) {
        chooseBoardSize()
    }
})
input.onButtonPressed(Button.B, function () {
    if (controllerState == 4) {
        serial.writeValue("size", boardSizeState)
        boardSizeState = 2
    } else if (controllerState >= 5) {
        controllerState = 3
        basic.showIcon(IconNames.Diamond)
        serial.writeLine("endgame")
        radio.sendString("endgame")
    }
})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    temp = serial.readLine()
    if (temp.includes("Y")) {
        if (controllerState == 1) {
            controllerState = 2
            welcomeScreen()
        }
    }
    if (temp.includes("serie")) {
        if (controllerState == 2) {
            controllerState = 3
            // basic.showString("Initiated " + serieID)
            // basic.showString("Press A to start a game")
            basic.showIcon(IconNames.Diamond)
        }
    }
    if (temp.includes("game")) {
        if (controllerState == 3) {
            controllerState = 4
            // basic.showString("Choose Board Size")
            basic.showLeds(`
                . . # # .
                . # . . .
                . . # . .
                . . . # .
                . # # . .
                `)
        }
    }
    if (temp.includes("board")) {
        if (controllerState == 4) {
            controllerState = 5
            currentP = Math.random() < 0.5 ? 1 : 2
            radio.sendValue("firstP", currentP)
            if (currentP == 1) {
                basic.showString("P1 Starts")
            } else {
                basic.showString("P2 Starts")
            }
        }
    }
    if (temp.includes("next")) {
        basic.showIcon(IconNames.Happy)
        music.playTone(587, music.beat(BeatFraction.Eighth))
        radio.sendString("valid")
    }
    if (temp.includes("notempty")) {
        basic.showIcon(IconNames.Confused)
        music.playTone(139, music.beat(BeatFraction.Half))
        radio.sendString("notempt")
    }
    if (temp.includes("outside")) {
        music.playTone(139, music.beat(BeatFraction.Half))
        basic.showLeds(`
            # . . . .
            . # . . .
            . . # . .
            . . . # .
            . . . . #
            `)
        radio.sendString("outside")
    }
    if (temp.includes("ninrow")) {
        music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once)
        winner = parseInt(temp.charAt(0))
        radio.sendValue("winningP", winner)
        if (winner == 1) {
            p1score += 1
        } else {
            p2score += 1
        }
        controllerState = 3
        basic.showString("A for new game")
    }
    if (temp.includes("full")) {
        music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once)
        controllerState = 3
        basic.showIcon(IconNames.Diamond)
        serial.writeLine("endgame")
        radio.sendString("endgame")
    }
})
function chooseBoardSize() {
    if (boardSizeState == 2 || boardSizeState == 10) {
        boardSizeState = 3
        basic.showLeds(`
            . # # # .
            . . . # .
            . # # # .
            . . . # .
            . # # # .
            `)
    } else if (boardSizeState == 3) {
        boardSizeState = 4
        basic.showLeds(`
            . # . # .
            . # . # .
            . # # # .
            . . . # .
            . . . # .
            `)
    } else if (boardSizeState == 4) {
        boardSizeState = 5
        basic.showLeds(`
            . # # # .
            . # . . .
            . # # # .
            . . . # .
            . # # # .
            `)
    } else if (boardSizeState == 5) {
        boardSizeState = 6
        basic.showLeds(`
            . # # # .
            . # . . .
            . # # # .
            . # . # .
            . # # # .
            `)
    } else if (boardSizeState == 6) {
        boardSizeState = 7
        basic.showLeds(`
            . # # # .
            . . . # .
            . . . # .
            . . . # .
            . . . # .
            `)
    } else if (boardSizeState == 7) {
        boardSizeState = 8
        basic.showLeds(`
            . # # # .
            . # . # .
            . # # # .
            . # . # .
            . # # # .
            `)
    } else if (boardSizeState == 8) {
        boardSizeState = 9
        basic.showLeds(`
            . # # # .
            . # . # .
            . # # # .
            . . . # .
            . # # # .
            `)
    } else if (boardSizeState == 9) {
        boardSizeState = 10
        basic.showLeds(`
            # # # # #
            . # # . #
            . # # . #
            . # # . #
            . # # # #
            `)
    }
}
radio.onDataPacketReceived(function ({ receivedString: name, receivedNumber: value }) {
    if (name == "yes" && controllerState == 0 && player1 == 0) {
        player1 = 1
        radio.sendString("1pnum")
        basic.showString("P1")
    }
    else if (name == "yes" && controllerState == 0 && player1 != 0) {
        player2 = 2
        radio.sendString("2pnum")
        basic.showString("P2")
        controllerState = 1
    }
    else if (name.includes("chosen")) {
        serial.writeLine(name)
    }
})
function welcomeScreen() {
    basic.showIcon(IconNames.Happy)
}
input.onButtonPressed(Button.AB, function () {
    if (controllerState == 2) {
        serial.writeLine("start")
        serieID = Math.randomRange(1, 99999)
        radio.sendValue("newSerie", serieID)
    }
    if (controllerState == 3) {
        radio.sendString("startGame")
    }
    if (controllerState > 3) {
        if (p1score > p2score) {
            overallwinner = player1
            p1score = 88
            p2score = 0
        } else if (p2score > p1score) {
            overallwinner = player2
            p2score = 88
            p1score = 0
        } else {
            p1score = 88
            p2score = 88
        }
        radio.sendValue("endSerie", overallwinner)
        serial.writeLine(`endSerie:${overallwinner}`)
        music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once)
        basic.showIcon(IconNames.Snake)
    }
})
let overallwinner = 0
let serieID = 0
let player2 = 0
let player1 = 0
let p2score = 0
let p1score = 0
let winner = 0
let controllerState = 0
let boardSizeState = 0
let currentP = 0
let temp = ""
let player = ""
boardSizeState = 2
promptPairing()
let display = grove.createDisplay(DigitalPin.P2, DigitalPin.P16)
// basic.showIcon(IconNames.Yes)
basic.forever(function () {
    if (controllerState >= 3) {
        display.bit(p1score / 10, 0)
        display.bit(p1score % 10, 1)
        display.point(true)
        display.bit(p2score / 10, 2)
        display.bit(p2score % 10, 3)
    }
})
