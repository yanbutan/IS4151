input.onButtonPressed(Button.A, function () {
    if (deviceState == 0) {
        deviceState = 7
        radio.sendString("yes")
        basic.showIcon(IconNames.Butterfly)
    } else if (deviceState == 3) {
        selectX()
    }
})
input.onButtonPressed(Button.B, function () {
    if (deviceState == 3) {
        selectY()
    }
})
input.onButtonPressed(Button.AB, function () {
    if (deviceState == 3 && yCoor != -1 && xCoor != -1) {
        deviceState = 4
        coor = "" + xCoor.toString() + ":" + yCoor.toString()
        radio.sendString("" + `${playerID}chosen:${coor}`)
        xCoor = -1
        yCoor = -1
    }
})
radio.onDataPacketReceived(function ({ receivedString: name, receivedNumber: value }) {
    if (name == "ttt") {
        if (deviceState == 0) {
            basic.showString("TTT? Press A To HS")
        }
    } else if (name.includes("pnum")) {
        if (deviceState == 7) {
            deviceState = 1
            playerID = parseInt(name.charAt(0))
        }
    } else if (name == "newSerie") {
        if (deviceState == 1) {
            deviceState = 2
            basic.showIcon(IconNames.Duck)
        }
    } else if (name == "startGame") {
        if (deviceState == 2) {
            basic.showIcon(IconNames.Duck)
        }
    } else if (name.includes("firstP")) {
        if (deviceState == 2 && value == playerID) {
            deviceState = 3
            radio.sendString("youare2")
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                `)
        }
    } else if (name == "youare2") {
        if (deviceState == 2) {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
        }
    } else if (name.includes("valid")) {
        if (deviceState == 2) {
            deviceState = 3
            basic.clearScreen()
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                `)
        } else if (deviceState == 4) {
            deviceState = 2
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
        }
    } else if (name.includes("notempt") || name.includes("outside")) {
        if (deviceState == 4) {
            deviceState = 3
            basic.clearScreen()
            basic.showLeds(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                `)
        }
    } else if (name == "winningP") {
        deviceState = 2
        if (value == playerID) {
            basic.showIcon(IconNames.Happy)
        } else {
            basic.showIcon(IconNames.Sad)
        }
    } else if (name == "endgame") {
        deviceState = 2
        basic.showIcon(IconNames.Duck)
        xCoor = -1
        yCoor = -1
    } else if (name == "endSerie") {
        if (value == playerID) {
            basic.showLeds(`
                . . . . .
                # . # . #
                # . # . #
                # . # . #
                . # . # .
                `)
        } else if (value == 0) {
            basic.showLeds(`
                . . . . .
                . # # # .
                . # . . #
                . # . . #
                . # # # .
                `)
        } else {
            basic.showLeds(`
                . . . . .
                . # . . .
                . # . . .
                . # . . .
                . # # # .
                `)
        }
    }
})
function selectY() {
    if (yCoor == -1) {
        yCoor = 0
        led.plot(3, 0)
    } else if (yCoor == 0) {
        yCoor = 1
        led.plot(4, 0)
    } else if (yCoor == 1) {
        yCoor = 2
        led.plot(3, 1)
    } else if (yCoor == 2) {
        yCoor = 3
        led.plot(4, 1)
    } else if (yCoor == 3) {
        yCoor = 4
        led.plot(3, 2)
    } else if (yCoor == 4) {
        yCoor = 5
        led.plot(4, 2)
    } else if (yCoor == 5) {
        yCoor = 6
        led.plot(3, 3)
    } else if (yCoor == 6) {
        yCoor = 7
        led.plot(4, 3)
    } else if (yCoor == 7) {
        yCoor = 8
        led.plot(3, 4)
    } else if (yCoor == 8) {
        yCoor = 9
        led.plot(4, 4)
    } else if (yCoor == 9) {
        yCoor = -1
        clearYCoor()
    }
}
function clearXCoor() {
    led.toggle(1, 4)
    led.toggle(0, 4)
    led.toggle(1, 3)
    led.toggle(0, 3)
    led.toggle(1, 2)
    led.toggle(0, 2)
    led.toggle(1, 1)
    led.toggle(0, 1)
    led.toggle(1, 0)
    led.toggle(0, 0)
}
function clearYCoor() {
    led.toggle(4, 4)
    led.toggle(3, 4)
    led.toggle(4, 3)
    led.toggle(3, 3)
    led.toggle(4, 2)
    led.toggle(3, 2)
    led.toggle(4, 1)
    led.toggle(3, 1)
    led.toggle(4, 0)
    led.toggle(3, 0)
}
function selectX() {
    if (xCoor == -1) {
        xCoor = 0
        led.plot(0, 0)
    } else if (xCoor == 0) {
        xCoor = 1
        led.plot(1, 0)
    } else if (xCoor == 1) {
        xCoor = 2
        led.plot(0, 1)
    } else if (xCoor == 2) {
        xCoor = 3
        led.plot(1, 1)
    } else if (xCoor == 3) {
        xCoor = 4
        led.plot(0, 2)
    } else if (xCoor == 4) {
        xCoor = 5
        led.plot(1, 2)
    } else if (xCoor == 5) {
        xCoor = 6
        led.plot(0, 3)
    } else if (xCoor == 6) {
        xCoor = 7
        led.plot(1, 3)
    } else if (xCoor == 7) {
        xCoor = 8
        led.plot(0, 4)
    } else if (xCoor == 8) {
        xCoor = 9
        led.plot(1, 4)
    } else if (xCoor == 9) {
        xCoor = -1
        clearXCoor()
    }
}
let coor = ""
let deviceState = 0
let yCoor = 0
let xCoor = 0
let gameID = 0
let serieID = 0
let playerID = 0
xCoor = -1
yCoor = -1
radio.setTransmitPower(7)
radio.setGroup(8)
radio.setTransmitSerialNumber(true)
basic.showIcon(IconNames.Yes)
basic.forever(function () {

})

// 0 : initial state
// 1 : handshake done
// 2 : serie init done
// 3 : selecting coordinates
// 4 :
