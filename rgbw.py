from flask import Flask, request, jsonify
import pigpio
import json


app = Flask(__name__)
pi = pigpio.pi()

# {{url}}/led?status=on
@app.route('/', methods=['GET'])
def led():

    red = int(request.args.get('red')) if (request.args.get('red')) else 0
    green = int(request.args.get('green')) if (request.args.get('green')) else 0
    blue = int(request.args.get('blue')) if (request.args.get('blue')) else 0
    # white = int(request.args.get('white')) if (request.args.get('white')) else 0

    pi.set_PWM_dutycycle(24, red)
    pi.set_PWM_dutycycle(20, blue)
    pi.set_PWM_dutycycle(25, green)
    # pi.set_PWM_dutycycle(18, white)

    # return jsonify({"red": red, "green": green, "blue": blue, "white": white})
    with open('/var/www/html/rgbw/rgb.json', 'w') as f:
        json.dump({"red": red, "green": green, "blue": blue}, f)
    return jsonify({"red": red, "green": green, "blue": blue})


# Separated white button for now so it can be controlled separately
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
