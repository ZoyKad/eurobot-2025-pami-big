// CONFIG \\

const CURRENT_PAMI: number = 4;
const TEST = false;

const FOURTH_COUNTDOWN = 87000
const FIRST_COUNTDOWN = 85000

const FW_L = 190
const FW_R = 240

const AVOIDANCE_DISTANCE = 15

// CONFIG END //

const SWITCH_COLOR = DigitalPin.P2
const SERVO = servos.P0
const SERVO_MIN = 0
const SERVO_MAX = 140

enum Color {
    Yellow,
    Blue
}

const movers = {
    forward: () => {
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Forward, FW_L);
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Forward, FW_R);
    },
    backward: () => {
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Backward, FW_L);
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Backward, FW_R);
    },
    turnLeft: () => {
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.LeftMotor);
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.RightMotor, maqueenPlusV2.MyEnumDir.Forward, FW_R);
    },
    turnRight: () => {
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.RightMotor);
        maqueenPlusV2.controlMotor(maqueenPlusV2.MyEnumMotor.LeftMotor, maqueenPlusV2.MyEnumDir.Forward, FW_L);
    },
    stop: () => {
        maqueenPlusV2.controlMotorStop(maqueenPlusV2.MyEnumMotor.AllMotor);
    }
}

function measureDistance() {
    return sonar.ping(DigitalPin.P15, DigitalPin.P14, PingUnit.Centimeters)
}

function runAndWatch(duration: number, remainingTime: number) {
    const pamiStart = control.millis()

    let lastStop: number | undefined = null;
    let stoppedTime = 0;
    let currentTime;

    do {
        currentTime = control.millis();
        const measuredDistance = measureDistance()

        if (measuredDistance < AVOIDANCE_DISTANCE) {
            if (!lastStop) {
                lastStop = control.millis()
                movers.backward();
                pause(20);
                movers.stop();
            }
        } else {
            if (lastStop) {
                stoppedTime += (currentTime - lastStop);
                lastStop = null;
            }
            movers.forward();
        }

        serial.writeLine("1st : " + ((currentTime - pamiStart) < remainingTime))
        serial.writeLine("2nd : " + (((currentTime - pamiStart) - stoppedTime) < duration))

        pause(10);
    } while (((currentTime - pamiStart) < remainingTime) && (((currentTime - pamiStart) - stoppedTime) < duration))
}

function pamiFourthYellow() {
    movers.forward();
    pause(700);
    movers.turnRight()
    pause(450);
    movers.forward();
    pause(1200);
    movers.turnLeft();
    pause(225);
    runAndWatch(1000, 100000 - FOURTH_COUNTDOWN - 2000);
    movers.stop();
}

function pamiOneYellow() {
    movers.forward();
    pause(700);
    movers.turnRight()
    pause(400);
    movers.forward();
    pause(300);
    movers.turnLeft();
    pause(400);
    runAndWatch(2100, 100000 - FIRST_COUNTDOWN - 2000);
    movers.stop();
}

function pamiFourthBlue() {
    movers.forward();
    pause(700);
    movers.turnLeft()
    pause(400);
    movers.forward();
    pause(300);
    movers.turnRight();
    pause(450);
    runAndWatch(1500, 100000 - FOURTH_COUNTDOWN - 2000);
    movers.stop();
}

function pamiOneBlue() {
    movers.forward();
    pause(700);
    movers.turnLeft()
    pause(400);
    movers.forward();
    pause(300);
    movers.turnRight();
    pause(400);
    runAndWatch(2100, 100000 - FIRST_COUNTDOWN - 2000);
    movers.stop();
}

function runServo() {
    for (; ;) {
        const angle = pins.map(
            Math.sin(control.millis() / 300),
            -1,
            1,
            SERVO_MIN,
            SERVO_MAX
        );
        SERVO.setAngle(angle);
        pause(10);
    }
}

pins.setPull(SWITCH_COLOR, PinPullMode.PullUp);
SERVO.setAngle(90);
pause((TEST) ? 2000 : (CURRENT_PAMI === 4) ? FOURTH_COUNTDOWN : FIRST_COUNTDOWN);
if (pins.digitalReadPin(SWITCH_COLOR) == Color.Yellow) {
    if (CURRENT_PAMI === 4) {
        pamiFourthYellow();
    } else {
        pamiOneYellow();
    }
} else {
    if (CURRENT_PAMI === 4) {
        pamiFourthBlue();
    } else {
        pamiOneBlue();
    }
}

runServo();