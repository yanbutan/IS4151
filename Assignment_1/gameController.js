let controllerState = 0;

function welcomeScreen(){
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
    controllerState = 1
    basic.showString("Press A to")
    basic.pause(500)
    basic.showString("Start Game")
}


input.onButtonPressed(Button.A, () => {
    if (controllerState == 0) {
        //Sends Pairing Request To Laptop
        controllerState = 1
    }
})

input.onButtonPressed(Button.B, () => { })

input.onButtonPressed(Button.AB, () => {
    if(controllerState == 1){
        //Starts game and go to next stage of table
    }
})

radio.onDataPacketReceived(() => 
{
    if (name=="accept"){
        //Com accepted pairing
        welcomeScreen()
        //Send to game devices
        radio.sendValue("start")
    }
})

promptPairing()
basic.forever(() => {
})