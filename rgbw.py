from flask import Flask, request, jsonify
import pigpio


app = Flask(__name__)


# {{url}}/led?status=on
@app.route('/', methods=['GET'])
def led():

    red = request.args.get('red') if (request.args.get('red')) else 0
    green = request.args.get('green') if (request.args.get('green')) else 0
    blue = request.args.get('blue') if (request.args.get('blue')) else 0
    white = request.args.get('white') if (request.args.get('white')) else 0

    pi = pigpio.pi()

    pi.set_PWM_dutycycle(24, red)
    pi.set_PWM_dutycycle(20, blue)
    pi.set_PWM_dutycycle(25, green)
    pi.set_PWM_dutycycle(18, white)

    return jsonify({"red": red, "green": green, "blue": blue, "white": white})

