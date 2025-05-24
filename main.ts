const CURRENT_PAMI: number = 1;

const FW_L = 190
const FW_R = 240

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

function pamiFourthYellow() {
    movers.forward();
    pause(700);
    movers.turnRight()
    pause(400);
    movers.forward();
    pause(700);
    movers.turnLeft();
    pause(400);
    movers.forward();
    pause(1500);
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
    pause(450);
    movers.forward();
    pause(2100);
    movers.stop();
}

function pamiFourthBlue() {
    movers.forward();
    pause(700);
    movers.turnLeft()
    pause(400);
    movers.forward();
    pause(500);
    movers.turnRight();
    pause(450);
    movers.forward();
    pause(1500);
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
    pause(450);
    movers.forward();
    pause(2100);
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
pause((CURRENT_PAMI === 4)? 86000: 85000);
SERVO.setAngle(90);
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