# BBC micro:bit as sensor-beacon

> Open this page at [https://georgbraun.github.io/microbit-sensor-beacon/](https://georgbraun.github.io/microbit-sensor-beacon/)

## Description

MakeCode-Project to use the BBC micro:bit as a source for sensor data via BLE advertising.

The idea is to continuously measure temperature or accelerometer data and publish it as BLE advertising payload.

To keep it simple, the Eddystone Beacon standard is used. While Eddystone offers TLM frames to transmit device telemetry data
such as battery level or sensor data, it seems that the micro:bit DAL is limited to Eddystone-UID and Eddystone-URL frames. 
In order to allow data readings in plain text, e.g. in beacon scanners, the Eddystone-URL frame is selected.

### Startup

After reset, the micro:bit displays a short message _"SENSOR BEACON"_ and advertises an Eddystone URL `http://sensor.beacon.iot`.
Note that this is not a real URL to be used in a web-browser but just a simple message for device identification.

After that, the device switches to **temperature mode**.


### Temperature Mode

In this mode, the current temperature value in °C is read as an integer number approximately once per second 
and broadcasted as Eddystone-URL accoring to the pattern

`http://temp/26`

In this example, `26` represents a temperature value of 26 °C (again, this is not a "real" URL but just text).

In addition to the BLE advertising, the value is also sent to the USB-Serial-Port as a plain number, e.g. `26`.

In this mode, a "T" is shown on the LED matrix to indicate temperature mode. A moving LED in the top row of the LED matrix indicates
new measurement data.

When button B is pressed, **acceleration mode** is selected.

### Acceleration Mode

In this mode, the current accelerometer data (x, y and z in g) is read approximately every 200 ms and broadcasted 
as Eddystone-URL accoring to the pattern

`http://ac/-0.1/-0.8/-0.6`

In this example, 

* `-0.1` represents an x-value of -0.1&nbsp;g
* `-0.8` represents a y-value of -0.8&nbsp;g
* `-0.6` represents a z-value of -0.6&nbsp;g

The individual values are limited to a maximum of one decimal digit. This is important to keep the overall length of the URL 
at or below **17 characters**, excluding the protocol `http://` which is encoded in a single byte in Eddystone URL frames.

In addition to the BLE advertising, the values are also sent to the USB-Serial-Port as plain numbers, e.g. `-0.1/-0.8/-0.6`.

In this mode, an "A" is shown on the LED matrix to indicate acceleration mode. A moving LED in the top row of the LED matrix indicates
new measurement data.

When button A is pressed, **temperature mode** is selected.


### Hex File and Board Versions

The current hex file can be fetched as [microbit-sensor-beacon.hex](https://github.com/GeorgBraun/microbit-sensor-beacon/raw/master/microbit-sensor-beacon.hex).

The program has been tested on micro:bit boards version 1.3B. Other versions should be okay, too, but have not been tested so far.


### Related Work

This work was inspired by a blog post by Atharva Inamdar from Sep 5, 2020, on medium.com: [BBC micro:bit as a Wireless Sensor](https://medium.com/analytics-vidhya/bbc-micro-bit-as-a-wireless-sensor-2624078137a0)

&nbsp;

---

The following section was automatically added by the MakeCode-Editor.

---

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/georgbraun/microbit-sensor-beacon** and import

## Edit this project ![Build status badge](https://github.com/georgbraun/microbit-sensor-beacon/workflows/MakeCode/badge.svg)

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/georgbraun/microbit-sensor-beacon** and click import

## Blocks preview

This image shows the blocks code from the last commit in master.
This image may take a few minutes to refresh.

![A rendered view of the blocks](https://github.com/georgbraun/microbit-sensor-beacon/raw/master/.github/makecode/blocks.png)

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
