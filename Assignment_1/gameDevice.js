let deviceState = 0;
let serieID = 0;
let gameID = 0;
radio.setTransmitPower(7);
radio.setGroup(8);
radio.setTransmitSerialNumber(true);

function showWelcome() {
    basic.showString("Welcome to");
    basic.pause(500);
    basic.showString("Tic Tac Toe");
}

input.onButtonPressed(Button.A, () => {
    if (deviceState == 0) {
    }
});

radio.onDataPacketReceived(
    ({ receivedString: name, receivedNumber: value }) => {
        if (name == "newSerie") {
            if (deviceState == 0) {
                deviceState = 1;
                showWelcome();
            }
        } else if (name == "startGame") {
            if (deviceState == 1) {
                basic.showIcon(IconNames.Duck);
            }
        }
    }
);

basic.showIcon(IconNames.Yes);
basic.forever(() => { });
//Device States
//0 : initial state
//1 : new series requested by controller
