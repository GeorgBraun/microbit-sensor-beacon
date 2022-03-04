"""Eddystone URL Beacon advertising temperature or accelerometer sensor data"""

# Message length limitation:
# The Eddystone URL frame allows a maximum of 17 ASCII characters
# excluding the protocol indicator (like http://)
# Example: bluetooth.advertise_url("http://123456789/1234567", 7, False)

# Globals
ringCtr = 0     # ring counter for running light indicator on LED matrix
tempMode = True # True for temperature, False for accelerometer

def initialize():
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
    led.plot(ringCtr, 0) # turn on LED running light indicator at current position
    if tempMode:
        tempC = str(input.temperature())
        serial.write_line(tempC)
        bluetooth.advertise_url("http://temp/" + tempC + "/", 7, False)
        basic.pause(1000)
    else:
        # accelerometer values range from 0 to 1023 as integer values,
        # with 1023 representing 1 g (9.81 m/s^2).
        # The following code normalizes the values to 1 g, limits the number
        # of decimal places to a maximum of 1 digit and converts the values
        # from float to string:
        accURL = str(Math.round(input.acceleration(Dimension.X)/102.3)/10) + '/' \
               + str(Math.round(input.acceleration(Dimension.Y)/102.3)/10) + '/' \
               + str(Math.round(input.acceleration(Dimension.Z)/102.3)/10)
        serial.write_line(accURL)
        bluetooth.advertise_url("http://ac/" + accURL, 7, False)
        basic.pause(200)
    led.unplot(ringCtr, 0) # turn off LED running light indicator at current position
    ringCtr += 1 # increment the current position of the running light indicator
    ringCtr %= 5 # and limit it to a maximum of 5 column (values range from 0 to 4).

initialize()
basic.forever(on_forever)
