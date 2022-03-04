/** Eddystone URL Beacon advertising temperature or accelerometer sensor data */
//  Message length limitation:
//  The Eddystone URL frame allows a maximum of 17 ASCII characters
//  excluding the protocol indicator (like http://)
//  Example: bluetooth.advertise_url("http://123456789/1234567", 7, False)
//  Globals
let ringCtr = 0
//  ring counter for running light indicator on LED matrix
let tempMode = true
//  True for temperature, False for accelerometer
function initialize() {
    bluetooth.advertiseUrl("http://sensor.beacon.iot", 7, false)
    basic.clearScreen()
    basic.showString("SENSOR BEACON", 65)
    basic.clearScreen()
    setTempMode()
}

function setTempMode() {
    
    tempMode = true
    basic.showLeds(`
        . . . . .
        . . . . .
        . # # # .
        . . # . .
        . . # . .
    `)
}

function setAccMode() {
    
    tempMode = false
    basic.showLeds(`
        . . . . .
        . # # . .
        # . . # .
        # # # # .
        # . . # .
    `)
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    setTempMode()
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    setAccMode()
})
//  and limit it to a maximum of 5 column (values range from 0 to 4).
initialize()
basic.forever(function on_forever() {
    let tempC: string;
    let accURL: string;
    
    
    led.plot(ringCtr, 0)
    //  turn on LED running light indicator at current position
    if (tempMode) {
        tempC = "" + input.temperature()
        serial.writeLine(tempC)
        bluetooth.advertiseUrl("http://temp/" + tempC + "/", 7, false)
        basic.pause(1000)
    } else {
        //  accelerometer values range from 0 to 1023 as integer values,
        //  with 1023 representing 1 g (9.81 m/s^2).
        //  The following code normalizes the values to 1 g, limits the number
        //  of decimal places to a maximum of 1 digit and converts the values
        //  from float to string:
        accURL = "" + Math.round(input.acceleration(Dimension.X) / 102.3) / 10 + "/" + ("" + Math.round(input.acceleration(Dimension.Y) / 102.3) / 10) + "/" + ("" + Math.round(input.acceleration(Dimension.Z) / 102.3) / 10)
        serial.writeLine(accURL)
        bluetooth.advertiseUrl("http://ac/" + accURL, 7, false)
        basic.pause(200)
    }
    
    led.unplot(ringCtr, 0)
    //  turn off LED running light indicator at current position
    ringCtr += 1
    //  increment the current position of the running light indicator
    ringCtr %= 5
})
