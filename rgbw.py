from flask import Flask, request, jsonify
import pigpio
import json, time
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

    change_led(oldred, red, red_pin)
    change_led(oldgreen, green, green_pin)
    change_led(oldblue, blue, blue_bin)

    # TODO: Look into multi processing later
    # p_red = Process(target=change_led, args=(oldred, red, red_pin))
    # p_green = Process(target=change_led, args=(oldgreen, green, green_pin))
    # p_blue = Process(target=change_led, args=(oldblue, blue, blue_bin))
    # if red < oldred:
    #     redstep = -1
    # else:
    #     redstep = 1
    #
    # for x in range(oldred, red, redstep):
    #     pi.set_PWM_dutycycle(24, x)
    #     time.sleep(transition_delay / (255))
    #
    # if green < oldgreen:
    #     greenstep = -1
    # else:
    #     greenstep = 1
    #
    # for x in range(oldgreen, green, greenstep):
    #     pi.set_PWM_dutycycle(25, x)
    #     time.sleep(transition_delay / (255))
    #
    # if blue < oldblue:
    #     bluestep = -1
    # else:
    #     bluestep = 1
    #
    # for x in range(oldred, blue, bluestep):
    #     pi.set_PWM_dutycycle(20, x)
    #     time.sleep(transition_delay / (255))

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
def white():
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


# TODO: Move to separate file to clean up
def change_led(current_color, new_color, pin):
    if new_color < current_color:
        step = -1
        # +1 So it's never divided by 0
        delay = transition_delay / (current_color - new_color + 1)
    else:
        step = 1
        # So it's never divided by 0
        delay = transition_delay / (new_color - current_color + 1)

    for x in range(current_color, new_color, step):
        pi.set_PWM_dutycycle(pin, x)
        time.sleep(delay)
