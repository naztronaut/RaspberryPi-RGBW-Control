from flask import Flask, request, jsonify
import change_led as cl
import pigpio
import json

# , time

# from multiprocessing import Process

app = Flask(__name__)
pi = pigpio.pi()
transition_delay = 0.5
red_pin = 24
green_pin = 25
blue_bin = 20
white_pin = 18


# {{url}}/led?status=on
@app.route('/', methods=['GET'])
def led():
    red = int(request.args.get('red')) if (request.args.get('red')) else 0
    green = int(request.args.get('green')) if (request.args.get('green')) else 0
    blue = int(request.args.get('blue')) if (request.args.get('blue')) else 0
    # white = int(request.args.get('white')) if (request.args.get('white')) else 0

    with open('/var/www/html/rgbw/rgb.json', 'r') as f:
        rgb = json.load(f)
        oldred = rgb['red']
        oldgreen = rgb['green']
        oldblue = rgb['blue']

    # Smooth transition
    cl.change_led(oldred, red, red_pin)
    cl.change_led(oldgreen, green, green_pin)
    cl.change_led(oldblue, blue, blue_bin)

    # TODO: Look into multi processing later
    # p_red = Process(target=change_led, args=(oldred, red, red_pin))
    # p_green = Process(target=change_led, args=(oldgreen, green, green_pin))
    # p_blue = Process(target=change_led, args=(oldblue, blue, blue_bin))

    # no smooth transition
    # pi.set_PWM_dutycycle(24, red)
    # pi.set_PWM_dutycycle(20, blue)
    # pi.set_PWM_dutycycle(25, green)
    # pi.set_PWM_dutycycle(18, white)

    # return jsonify({"red": red, "green": green, "blue": blue, "white": white})
    with open('/var/www/html/rgbw/rgb.json', 'w') as f:
        json.dump({"red": red, "green": green, "blue": blue}, f)
    return jsonify({"red": red, "green": green, "blue": blue})


# Separated white button for now so it can be controlled separately
# Reading/writing to JSON file: https://stackabuse.com/reading-and-writing-json-to-a-file-in-python/
@app.route('/white', methods=['GET'])
def white_led():
    white = int(request.args.get('white')) if (request.args.get('white')) else 0

    pi.set_PWM_dutycycle(18, white)
    with open('/var/www/html/rgbw/white.json', 'w') as f:
        json.dump({"white": white}, f)
    return jsonify({"white": white})


@app.route('/getStatus', methods=['GET'])
def get_status():
    colors = str(request.args.get('colors'))

    with open('/var/www/html/rgbw/' + colors + '.json', 'r') as f:
        return json.load(f)
