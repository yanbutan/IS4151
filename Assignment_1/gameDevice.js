let deviceState = 0;
radio.setTransmitPower(7)
radio.setGroup(8)
radio.setTransmitSerialNumber(true)

// function handshake(){
//     radio.setTransmitPower(7)
//     radio.setGroup(8)
//     radio.setTransmitSerialNumber(true)
//     deviceState = 0
// }

function showWelcome() {
    basic.showString("Welcome to")
    basic.pause(500)
    basic.showString("Tic Tac Toe")
}


input.onButtonPressed(Button.A, () => {
    if (deviceState == 0) {
        deviceState = 1
    }
})

radio.onDataPacketReceived(() => {
    if (name == "start") {
        showWelcome()
    }
})

basic.showIcon(IconNames.Yes)
basic.forever(() => {
})