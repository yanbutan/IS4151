let gameState = 0
let gameId = 0
let response = 0
let otherResponse = ""
let result = 0;

function initGame()  
{
    radio.setTransmitPower(7)
    radio.setGroup(8)
    radio.setTransmitSerialNumber(true)
    gameState = 0
    gameId = 0
    response = 0
    otherResponse = ""
	result = 0
}

function showWelcome()  
{
    basic.showString("Welcome to")
    basic.showIcon(IconNames.Scissors)
    basic.pause(500)
    basic.showIcon(IconNames.Square)
    basic.pause(500)
    basic.showIcon(IconNames.Target)
    basic.pause(500)
    basic.showString("Press A to start")
    basic.showIcon(IconNames.Yes)
}

function showResponsePrompt()
{
    basic.showString("Enter Response")
    basic.showLeds(`
        . # # # .
        # . . . #
        . . # # .
        . . # . .
        . . # . .
        `)
}

function showResult()
{
	gameState = 6
	basic.showString("Game Over")
	
	
	if(result == -1)
	{
		basic.showIcon(IconNames.Sad)
	}
	else if(result == 1)
	{
		basic.showIcon(IconNames.Happy)
	}
	else if(result == 0)
	{
		basic.showLeds(`
        . . . . .
        . . . . .
        1 1 1 1 1
        . . . . .
        . . . . .
        `)
	}
		
}

function processResult() 
{
	if(response == 1)
	{
		if(otherResponse == "rspSciss")
		{
			result = 0
		}
		else if(otherResponse == "rspPaper")
		{
			result = 1;
		}
		else if(otherResponse == "rspStone")
		{
			result = -1;
		}			
	}
	else if(response == 2)
	{
		if(otherResponse == "rspSciss")
		{
			result = -1
		}
		else if(otherResponse == "rspPaper")
		{
			result = 0;
		}
		else if(otherResponse == "rspStone")
		{
			result = 1;
		}			
	}
	else if(response == 3)
	{
		if(otherResponse == "rspSciss")
		{
			result = 1
		}
		else if(otherResponse == "rspPaper")
		{
			result = -1;
		}
		else if(otherResponse == "rspStone")
		{
			result = 0;
		}			
	}
	
	basic.showString("Other Response")
	
	if (otherResponse == "rspSciss") 
	{
		basic.showIcon(IconNames.Scissors)
	}
	else if (otherResponse == "rspPaper") 
	{
		basic.showIcon(IconNames.Square)
	}
	else if (otherResponse == "rspStone") 
	{
		basic.showIcon(IconNames.Target)
	}
	
	basic.pause(100)
	showResult()
}

input.onButtonPressed(Button.A, () => 
{
    if (gameState == 0) {
        gameState = 1
        gameId = Math.randomRange(1, 99999)
        radio.sendValue("newReq", gameId)
		basic.showString("Initiated " +  gameId)
		basic.showLeds(`
        . # # # .
        # . . . #
        . . # # .
        . . # . .
        . . # . .
        `)
    }
	else if (gameState == 2)
	{
		gameState = 3
		radio.sendValue("accepReq", gameId)
        basic.showString("Accepted " +  gameId)
		showResponsePrompt()
	}
    else if (gameState == 3 || gameState == 7)
    {       
		response = 1
        radio.sendValue("rspSciss", gameId)
        basic.showString("You choose")
        basic.showIcon(IconNames.Scissors)
		
		if(gameState == 7)
		{
			gameState = 4
			processResult()
		}
		
		gameState = 4
    }
	else if (gameState == 6)
	{
		gameState = 0
		basic.showString("Restart")
		basic.showString("Press A to start")
		basic.showIcon(IconNames.Yes)
	}
		
})

input.onButtonPressed(Button.B, () => 
{
    if (gameState == 3 || gameState == 7)
    {       
		response = 2
        radio.sendValue("rspPaper", gameId)
        basic.showString("You choose")
        basic.showIcon(IconNames.Square)
		
		if(gameState == 7)
		{
			gameState = 4
			processResult()
		}
		
		gameState = 4
    }
})

input.onButtonPressed(Button.AB, () => 
{    
	if (gameState == 3 || gameState == 7)
    {       
		response = 3
        radio.sendValue("rspStone", gameId)
        basic.showString("You choose")
        basic.showIcon(IconNames.Target)
		
		if(gameState == 7)
		{
			gameState = 4
			processResult()
		}
		
		gameState = 4
    }
})

radio.onDataPacketReceived(({ receivedString: name, receivedNumber: value }) => 
{    
	if (name == "newReq") 
	{
        if (gameState == 0) 
		{
			gameState = 2
			gameId = value
            basic.showString("New request " +  gameId)
			basic.showLeds(`
			. # # # .
			# . . . #
			. . # # .
			. . # . .
			. . # . .
			`)
        }
    } 
	else if (name == "accepReq") 
	{
        if (gameState == 1 && value == gameId) 
		{
            gameState = 3
            basic.showString("Started")
			showResponsePrompt()
        }
    }
	else if (((name == "rspSciss") || (name == "rspPaper") || (name == "rspStone")))
	{
		if(value == gameId)
		{
			if(gameState == 4)
			{
				gameState = 5
				otherResponse = name
				processResult()
			}
			else if(gameState == 3)
			{
				gameState = 7
				otherResponse = name
			}
		}
	}
})

initGame()
showWelcome()
basic.forever(() => 
{	
})
