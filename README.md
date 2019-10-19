# Raspberry Pi - Control RGBW LED Strip from your browser

Controlling RGBW LED Strip lights from your browser with a Raspberry Pi Zero.

<center>
<img src="./img/thumbnail.png" width="700px" alt="Kitchen Cabinet Raspberry Pi Lights">
</center>

## Getting Started

This project contains the tutorial files for EasyProgramming.net. 

If you've followed my other tutorials, browser control should be something that is familiar to you. The requirements below should also be very familiar:

### Hardware

In order to complete this project, you will need some of these hardware:

* [ ] Raspberry Pi - can use Zero, Zero W, 2, 3, 4
* [ ] *(Optional)* Wireless dongle - If you are using the basic Pi 0 v1.3. This is not necessary for the other versions of the Pi.
* [ ] RGBW LED Strip - These normally have 5 connections, One for each color and an additional for Ground. 
* [ ] Pi Power Supply - need 5V to your Pi
* [ ] LED Strip Power Supply - 12V power adapter passing 1-2 Amps of current will be sufficient. This should also work with a 24V LED Strip.
* [ ] Logic Level MOSFET Transistor - I use MOSFETS for this project. They can be any logic-level transistor (most of them start with IRL - the L is for 'logic'). 
It just needs to be able to turn on with 5v or less of power.
* [ ] Wiring - You need 5 wires to connect the LEDs and Ground. You can find adapters or you can use individual wires. 
* [ ] *(Optional)* Aluminum Extrusion - although not necessary, an aluminum extrusion will help dissipate heat as well as make your installation more sturdy.
* [ ] *(Optional)* Pi Case - Something to house your Pi and Relay. You can make your own or if you want, you can just leave it as is but be careful of shorts 
and electric shocks!
* [ ] *(Optional)* Soldering Iron - if you are comfortable, it is best to solder the lights and connections in place so they don't disconnect easily. 
* [ ] Tools - a wire cutter/stripper would be most helpful to you.  

### Prerequisites
The prerequisites for this tutorial is the same as the last because everything in this tutorial is the end product of what we've learned so far about 
the Raspberry Pi and some things we learned with JavaScript and jQuery. If you get stuck anywhere, take a look at these tutorials:

1. [Headless Raspberry Pi](https://www.easyprogramming.net/raspberrypi/headless_raspbery_pi.php)
2. Previously we needed RPi.GPIO library, for this, we need pigpiod - More info at http://abyz.me.uk/rpi/pigpio/pigpiod.html
3. [Run Apache on your Pi](https://www.easyprogramming.net/raspberrypi/pi_apache_web_server.php)
4. [Running a Flask App on your Pi](https://www.easyprogramming.net/raspberrypi/pi_flask_app_server.php)
5. [Run Flask behind Apache](https://www.easyprogramming.net/raspberrypi/pi_flask_apache.php)
6. [Simple AJAX with jQuery/JavaScript](https://www.easyprogramming.net/jQuery/get_data_ajax_method.php)

### Installation 

Follow the tutorial here to learn how to run a Flask app behind Apache: https://www.easyprogramming.net/raspberrypi/pi_flask_apache.php

As stated in the above tutorial and in the [Prerequisites](#prerequisites), here's a very quick checklist for this project:

* [ ] Apache
* [ ] venv (virtual environment)
* [ ] `activate-this.py` inside your venv
* [ ] Mod-WSGI [More info below](#apche-and-wsgi)
* [] `pigpiod`

Since we are running `pigpiod` from a virtual environment, we need to install it in our venv:

```bash
wget abyz.me.uk/rpi/pigpio/pigpio.zip
unzip pigpio.zip
cd PIGPIO
make
sudo make install
```

I will also include a version of the app in this repo as a backup. 

## Authors
* **Nazmus Nasir** - [Nazm.us](https://nazm.us) - Owner of EasyProgramming.net

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

# Questions ?
Have questions? You can reach me through several different channels. You can ask a question in the  [issues forum](/../../issues), 
on [EasyProgramming.net](https://www.easyprogramming.net), or on the vide comments on YouTube. 


# Contribute 
I will accept Pull requests fixing bugs or adding new features after I've vetted them. Feel free to create pull requests! 