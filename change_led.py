import pigpio
import time

pi = pigpio.pi()
transition_delay = 0.5


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

