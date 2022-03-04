"""Eddystone Beacon sending temperature or accelerometer data as URL."""

# Globals
ringCtr = 0     # Ringcounter for moving LED indicator
tempMode = True # True for temperature, False for accelerometer

def initialize():
    # Maximale Zeichenanzahl hinter http:// beträgt 17
    # bluetooth.advertise_url("http://123456789/1234567", 7, False)
    bluetooth.advertise_url("http://sensor.beacon.iot", 7, False)
    basic.clear_screen()
    basic.show_string("SENSOR BEACON", 65)
    basic.clear_screen()
    setTempMode()

def setTempMode():
    global tempMode
    tempMode = True
    basic.show_leds("""
        . . . . .
        . . . . .
        . # # # .
        . . # . .
        . . # . .
    """)

def setAccMode():
    global tempMode
    tempMode = False
    basic.show_leds("""
        . . . . .
        . # # . .
        # . . # .
        # # # # .
        # . . # .
    """)

def on_button_pressed_a():
    setTempMode()
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    setAccMode()
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_forever():
    global tempMode
    global ringCtr
    led.plot(ringCtr, 0)
    if tempMode:
        tempC = str(input.temperature())
        serial.write_line(tempC)
        #basic.show_number(tempC)
        #led.plot_bar_graph(tempC, 50)
        bluetooth.advertise_url("http://temp/" + tempC + "/", 7, False)
        basic.pause(500)
    else:
        accURL = str(Math.round(input.acceleration(Dimension.X)/102.3)/10) + '/' \
               + str(Math.round(input.acceleration(Dimension.Y)/102.3)/10) + '/' \
               + str(Math.round(input.acceleration(Dimension.Z)/102.3)/10)
        #accURL = str(Math.round_with_precision(input.acceleration(Dimension.X)/1000, 1)) + '/' \
        #       + str(Math.round_with_precision(input.acceleration(Dimension.Y)/1000, 1)) + '/' \
        #       + str(Math.round_with_precision(input.acceleration(Dimension.Z)/1000, 1))
        serial.write_line(accURL)
        bluetooth.advertise_url("http://ac/" + accURL, 7, False)
        basic.pause(100)
    led.unplot(ringCtr, 0)
    ringCtr += 1
    ringCtr %= 5

initialize()
basic.forever(on_forever)
