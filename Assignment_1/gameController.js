input.onButtonPressed(Button.A, function () {
    if (controllerState == 0) {
        // Sends Pairing Request To Laptop
        serial.writeLine("Care for a game of Tic Tac Toe?Y/N");
    }
});

input.onButtonPressed(Button.B, function () { });

serial.onDataReceived(serial.delimiters(Delimiters.NewLine), () => {
    if (serial.readLine().includes("Y")) {
        if (controllerState == 0) {
            controllerState = 1;
            serieID = Math.randomRange(1, 99999);
            radio.sendValue("newSerie", serieID);
            welcomeScreen();
            basic.showString("Initiated " + serieID);
        }
    } else if (serial.readLine().includes("start serie")) {
        if (controllerState == 1) {
            controllerState = 2;
            basic.showString("Press A to start a game");
        }
    }
});
function welcomeScreen() {
    basic.showString("Tic Tac Toe");
    basic.pause(500);
    basic.showString("Press A+B to start a new serie");
}
function promptPairing() {
    radio.setTransmitPower(7);
    radio.setGroup(8);
    radio.setTransmitSerialNumber(true);
    basic.showIcon(IconNames.Yes);
}
input.onButtonPressed(Button.AB, function () {
    if (controllerState == 1) {
        serial.writeLine("start");
        radio.sendString("startGame");
    }
});
radio.onDataPacketReceived(function () { });
let controllerState = 0;
let serieID = 0;
promptPairing();
// basic.showIcon(IconNames.Yes)
basic.forever(function () { });
//Controller States
//0 : initial state
//1 : pairing request accepted by game board, and new serie request sent to devices
//2 : game started
