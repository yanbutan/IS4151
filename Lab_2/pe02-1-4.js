input.onButtonPressed(Button.A, () => {
    messageState += 1
    if (messageState > 5) {
        messageState = 1
    }
    updateMessageLed()
})



input.onButtonPressed(Button.B, () => {
    if (messageState > 0) {
        radio.sendString(messages[messageState - 1])
        basic.showIcon(IconNames.Happy)
    } else {
        basic.showIcon(IconNames.Sad)
    }
    basic.pause(3000)
    updateMessageLed()
})



input.onButtonPressed(Button.AB, () => {
    messageState = 0
    basic.showIcon(IconNames.No)
})



radio.onDataPacketReceived( ({ receivedString }) =>  {
    showNewMessageLed()
    basic.pause(3000)
    basic.showString(receivedString)
    updateMessageLed()
})



basic.forever(() => {
	
})



function updateMessageLed()  {
    if (messageState == 0) {
        basic.showIcon(IconNames.No)
    } else if (messageState == 1) {
        basic.showLeds(`
            # . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    } else if (messageState == 2) {
        basic.showLeds(`
            # . . . .
            # # . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    } else if (messageState == 3) {
        basic.showLeds(`
            # . . . .
            # # . . .
            # # # . .
            . . . . .
            . . . . .
            `)
    } else if (messageState == 4) {
        basic.showLeds(`
            # . . . .
            # # . . .
            # # # . .
            # # # # .
            . . . . .
            `)
    } else if (messageState == 5) {
        basic.showLeds(`
            # . . . .
            # # . . .
            # # # . .
            # # # # .
            # # # # #
            `)
    }
}



function showNewMessageLed()  {
	basic.showLeds(`
        # # # # #
        # # . # #
        # . # . #
        # . . . #
        # # # # #
        `)
}



let messages: string[];
messages = ["Msg 1", "Msg 2", "Msg 3", "Msg 4", "Msg 5"]
let messageState = 0
messageState = 0
radio.setGroup(7)
radio.setTransmitPower(7)
basic.showIcon(IconNames.Yes)