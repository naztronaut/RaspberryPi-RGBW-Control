from flask import Flask, request, jsonify
import pigpio


app = Flask(__name__)


# {{url}}/led?status=on
@app.route('/', methods=['GET'])
def led():
    red = request.args.get('red')
    green = request.args.get('green')
    blue = request.args.get('blue')
    white = request.args.get('white')

    pi = pigpio.pi()

    pi.set_PWM_dutycycle(24, red)
    pi.set_PWM_dutycycle(20, blue)
    pi.set_PWM_dutycycle(25, green)
    pi.set_PWM_dutycycle(18, white)

