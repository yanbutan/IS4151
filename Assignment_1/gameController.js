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
    }
})
input.onButtonPressed(Button.B, function () {
	
})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    if (serial.readLine().includes("Y")) {
        if (controllerState == 1) {
            controllerState = 2
            welcomeScreen()
        }
    }
    if (serial.readLine().includes("serie")) {
        if (controllerState == 2) {
            controllerState = 3
            basic.showString("Initiated " + serieID)
            basic.showString("Press A to start a game")
            basic.showIcon(IconNames.Diamond)
        }
    }
    if (serial.readLine().includes("game")) {
        if (controllerState == 3) {
            controllerState = 4
            basic.showString("Choose Board Size")
            basic.showLeds(`
                . . # # .
                . # . . .
                . . # . .
                . . . # .
                . # # . .
                `)
        }
    }
})
function promptPairing () {
    radio.setTransmitPower(7)
    radio.setGroup(8)
    radio.setTransmitSerialNumber(true)
    basic.showIcon(IconNames.Yes)
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
})
radio.onDataPacketReceived(function ({ receivedString: name, receivedNumber: value }) {
    if (name == "yes" && controllerState == 0 && player1 == 0) {
        player1 = value
        basic.showString("P1 Ready")
    } else if (name == "yes" && controllerState == 0 && player1 != 0) {
        player2 = value
        basic.showString("P2 Ready")
        controllerState = 1
    }
})
function welcomeScreen () {
    basic.showString("Tic Tac Toe")
    basic.pause(500)
    basic.showString("Press A+B for a new serie")
}
let player2 = 0
let player1 = 0
let serieID = 0
let controllerState = 0
promptPairing()
let display = grove.createDisplay(DigitalPin.P2, DigitalPin.P16)
// basic.showIcon(IconNames.Yes)
basic.forever(function () {
    if (controllerState == 3) {
        let p2SecondDigit = 0
        let p2FirstDigit = 0
        let p1SecondDigit = 0
        let p1FirstDigit = 0
        display.bit(p1FirstDigit, 0)
        display.bit(p1SecondDigit, 1)
        display.bit(p2FirstDigit, 2)
        display.bit(p2SecondDigit, 3)
    }
})

//0 : initial state
//1 : handshake with game devices done
//2 : handshake with game board done
//3 : serie initialization done
//4 : game board size chosen
