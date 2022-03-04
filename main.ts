/** Eddystone Beacon sending temperature or accelerometer data as URL. */
//  Globals
let ringCtr = 0
//  Ringcounter for moving LED indicator
let tempMode = true
//  True for temperature, False for accelerometer
function initialize() {
    //  Maximale Zeichenanzahl hinter http:// beträgt 17
    //  bluetooth.advertise_url("http://123456789/1234567", 7, False)
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
initialize()
basic.forever(function on_forever() {
    let tempC: string;
    let accURL: string;
    
    
    led.plot(ringCtr, 0)
    if (tempMode) {
        tempC = "" + input.temperature()
        serial.writeLine(tempC)
        // basic.show_number(tempC)
        // led.plot_bar_graph(tempC, 50)
        bluetooth.advertiseUrl("http://temp/" + tempC + "/", 7, false)
        basic.pause(500)
    } else {
        accURL = "" + Math.round(input.acceleration(Dimension.X) / 102.3) / 10 + "/" + ("" + Math.round(input.acceleration(Dimension.Y) / 102.3) / 10) + "/" + ("" + Math.round(input.acceleration(Dimension.Z) / 102.3) / 10)
        // accURL = str(Math.round_with_precision(input.acceleration(Dimension.X)/1000, 1)) + '/' \
        //        + str(Math.round_with_precision(input.acceleration(Dimension.Y)/1000, 1)) + '/' \
        //        + str(Math.round_with_precision(input.acceleration(Dimension.Z)/1000, 1))
        serial.writeLine(accURL)
        bluetooth.advertiseUrl("http://ac/" + accURL, 7, false)
        basic.pause(100)
    }
    
    led.unplot(ringCtr, 0)
    ringCtr += 1
    ringCtr %= 5
})
