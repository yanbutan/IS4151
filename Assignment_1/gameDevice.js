input.onButtonPressed(Button.A, function () {
    if (deviceState == 0) {
        deviceState = 1
        playerID = Math.randomRange(1, 99999)
        radio.sendValue("yes", playerID)
        basic.showIcon(IconNames.Butterfly)
    }
})
radio.onDataPacketReceived(function ({ receivedString: name, receivedNumber: value }) {
    if (name == "ttt") {
        if (deviceState == 0) {
            basic.showString("TTT? Press A To HS")
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
    }
})
let deviceState = 0
let playerID = 0
let gameID = 0
let serieID = 0
radio.setTransmitPower(7)
radio.setGroup(8)
radio.setTransmitSerialNumber(true)
basic.showIcon(IconNames.Yes)
basic.forever(function () {

})

// 0 : initial state
// 1 : handshake done
// 2 : serie init done
