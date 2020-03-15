input.onButtonPressed(Button.A, function () {
    if (controllerState == 0) {
        // Sends Pairing Request To Laptop
        serial.writeLine("Care for a game of Tic Tac Toe?Y/N")
        controllerState = 1
    }
})
input.onButtonPressed(Button.B, function () {

})
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), () => {
    if (serial.readLine().includes("Y")) {
        welcomeScreen()
    } else {
        basic.showIcon(IconNames.Sad)
    }
})
function welcomeScreen() {
    basic.showString("Welcome To")
    basic.pause(500)
    basic.showString("Tic Tac Toe")
    basic.pause(500)
    basic.showString("Press A+B to start a new serie")
}
function promptPairing() {
    radio.setTransmitPower(7)
    radio.setGroup(8)
    radio.setTransmitSerialNumber(true)
    basic.showIcon(IconNames.Yes)
}
input.onButtonPressed(Button.AB, function () {
    if (controllerState == 1) {

    }
})
radio.onDataPacketReceived(function () {

})
let controllerState = 0
promptPairing()
// basic.showIcon(IconNames.Yes)
basic.forever(function () {

})
