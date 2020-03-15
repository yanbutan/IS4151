let enemyY = 0
let enemyX = 0
let enemyDirection = 0
let enemySpeed = 0
let enemyBaseTime = 0
let chaserY = 0
let chaserX = 0
let chaserDirection = 0
let chaserSpeed = 0
let chaserBaseTime = 0

let gameState = 0



function showWelcome() 
{
    basic.showString("Welcome to CHASER!")
    basic.showLeds(`
        # . . # #
        . . # # #
        . # # # .
        # # # . .
        # # . . #
        `)
    basic.pause(500)
    basic.clearScreen()
    basic.pause(500)
    basic.showLeds(`
        # . . # #
        . . # # #
        . # # # .
        # # # . .
        # # . . #
        `)
    basic.pause(500)
    basic.clearScreen()
    basic.pause(500)
    basic.showLeds(`
        # . . # #
        . . # # #
        . # # # .
        # # # . .
        # # . . #
        `)
    basic.pause(500)
    basic.clearScreen()
    basic.showString("Press A to start")
    basic.showIcon(IconNames.Yes)
}



input.onButtonPressed(Button.A, function () 
{
    if (gameState == 0) 
	{
        basic.clearScreen()

        gameState = 1

        enemyBaseTime = input.runningTime()
		
        while (true) 
		{
            enemyX = Math.randomRange(0, 4)
            enemyY = Math.randomRange(0, 4)
            if (enemyX != 2 && enemyY != 2) 
			{
                break;
            }
        }
		
        enemyDirection = Math.randomRange(1, 4)
        enemySpeed = 900
        led.plot(enemyX, enemyY)

        chaserBaseTime = enemyBaseTime
        chaserX = 2
        chaserY = 2
        chaserDirection = 1
        chaserSpeed = 1200

        led.plot(chaserX, chaserY)
    }
    else if (gameState == 1) 
	{
        chaserDirection = chaserDirection - 1

        if (chaserDirection < 1) 
		{
            chaserDirection = 4
        }
    }
    else if (gameState == 2) 
	{
        gameState = 0
    }
})

input.onButtonPressed(Button.B, function () 
{
    if (gameState == 1) 
	{
        chaserDirection = chaserDirection + 1

        if (chaserDirection > 4) 
		{
            chaserDirection = 1
        }
    }
})


input.onButtonPressed(Button.AB, function () 
{
    if (gameState == 1) 
	{
        chaserSpeed = chaserSpeed - 300

        if (chaserSpeed < 600) 
		{
            chaserSpeed = 1200
        }
    }
})

function moveEnemy() 
{
    led.unplot(enemyX, enemyY)

    if (Math.randomRange(1, 2) == 1) 
	{
        enemyDirection = Math.randomRange(1, 4)
    }

    if (enemyDirection == 1) 
	{
        enemyY = enemyY - 1

        if (enemyY < 0) 
		{
            enemyY = 4
        }
    }

    if (enemyDirection == 2)
	{
        enemyX = enemyX + 1

        if (enemyX > 4) 
		{
            enemyX = 0
        }
    }

    if (enemyDirection == 3) 
	{
        enemyY = enemyY + 1

        if (enemyY > 4) 
		{
            enemyY = 0
        }
    }

    if (enemyDirection == 4) 
	{
        enemyX = enemyX - 1

        if (enemyX < 0) 
		{
            enemyX = 4
        }
    }

    led.plot(enemyX, enemyY)
}

function moveChaser() 
{
    led.unplot(chaserX, chaserY)

    if (chaserDirection == 1) 
	{
        chaserY = chaserY - 1

        if (chaserY < 0) 
		{
            chaserY = 4
        }
    }

    if (chaserDirection == 2) 
	{
        chaserX = chaserX + 1

        if (chaserX > 4) 
		{
            chaserX = 0
        }
    }

    if (chaserDirection == 3) 
	{
        chaserY = chaserY + 1

        if (chaserY > 4) 
		{
            chaserY = 0
        }
    }

    if (chaserDirection == 4) 
	{
        chaserX = chaserX - 1

        if (chaserX < 0) 
		{
            chaserX = 4
        }
    }

    led.plot(chaserX, chaserY)
}


gameState = 0
enemyBaseTime = 0
enemySpeed = 0
enemyX = 0
enemyY = 0
enemyDirection = 0
showWelcome()

basic.forever(function () 
{
    basic.pause(100)

    if (gameState == 1) 
	{

        if (input.runningTime() - enemyBaseTime >= enemySpeed) 
		{
            enemyBaseTime = input.runningTime()
            moveEnemy()
        }

        if (input.runningTime() - chaserBaseTime >= chaserSpeed) 
		{
            chaserBaseTime = input.runningTime()
            moveChaser()
        }

        if (chaserX == enemyX && chaserY == enemyY) 
		{
            gameState = 2
        }
    }
    else if (gameState == 2) 
	{
        basic.showIcon(IconNames.Happy)
    }
    else if (gameState == 0) 
	{
        basic.showIcon(IconNames.Yes)
    }
})
