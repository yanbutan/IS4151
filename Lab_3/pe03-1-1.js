input.onButtonPressed(Button.A, function () {
    messageState += 1
    if (messageState > 6) {
        messageState = 1
    }
    updateMessageLed()
})

input.onButtonPressed(Button.B, function () {
    if (messageState > 0) {
        if (messageState >= 1 && messageState <= 5) {
            radio.sendString("" + messages[messageState - 1])
            basic.showIcon(IconNames.Happy)
        } else {
            autoMode = 1
            autoMessageState = 0
            autoTime = input.runningTime()
        }
    } else {
        basic.showIcon(IconNames.Sad)
    }
    basic.pause(3000)
    updateMessageLed()
})

input.onButtonPressed(Button.AB, function () {
    messageState = 0
    basic.showIcon(IconNames.No)
})

radio.onDataPacketReceived(function ({ receivedString }) {
    buffer1 = receivedString.split(",")
	saveCurrentMessage = 1
    
	for (let rxMsgHis of rxMessagesHistory) {
        buffer2 = rxMsgHis.split(",")
		if (buffer1[0] == buffer2[0] && buffer1[1] == buffer2[1]) {
            saveCurrentMessage = 0
            break
        }
    }
	
    if (saveCurrentMessage == 1) {
        showNewMessageLed()
        basic.pause(500)
        basic.showString("" + buffer1[2])
		
        radio.sendString("" + receivedString)
        rxMessagesHistory.push(receivedString)
    }
})

function showNewMessageLed () {
    basic.showLeds(`
        # # # # #
        # # . # #
        # . # . #
        # . . . #
        # # # # #
        `)
}

function updateMessageLed () {
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
    } else if (messageState == 6) {
        basic.showLeds(`
            # # # # #
            . # # # #
            . . # # #
            . . . # #
            . . . . #
            `)
    }
}

let autoTime = 0
let autoMessageState = 0
let autoMode = 0

let messageState = 0
messageState = 0
let saveCurrentMessage: number
let messageCounter: number
messageCounter = 0
let strSerialNo: string
let strSystemTime: string

let messages: string[];
messages = ["1", "2", "3", "4", "5"]

let rxMessagesHistory: string[];
rxMessagesHistory = []

let buffer1: string[]
let buffer2: string[]

radio.setGroup(7)
radio.setTransmitPower(7)
basic.showIcon(IconNames.Yes)

basic.forever(function () {
    if (autoMode == 1) {
        if (input.runningTime() - autoTime >= 3 * 1000) {
            basic.showNumber(autoMessageState + 1)
            messageCounter = messageCounter + 1
            radio.sendString("" + control.deviceName() + "," + messageCounter + "," + messages[autoMessageState])
            rxMessagesHistory.push("" + control.deviceName() + "," + messageCounter + "," + messages[autoMessageState])
            autoMessageState = autoMessageState + 1
            if (autoMessageState > 4) {
                autoMessageState = 0
            }
            autoTime = input.runningTime()
        }
    }
})
