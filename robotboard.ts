/**
* Makecode extensions for Robot Board
*/

namespace SGBotic {
    export enum lineSensor {
        A = 0x01,
        B = 0x02,
        C = 0x03,
        D = 0x04
    }

    export enum direction {
        forward = 0x01,
        reverse = 0x02
    }

    // lower PWM frequency for slower speeds to improve torque
    function setPWM(speed: number): void {
        if (speed < 200) {
            pins.analogSetPeriod(AnalogPin.P13, 60000);
            pins.analogSetPeriod(AnalogPin.P14, 60000);
            pins.analogSetPeriod(AnalogPin.P15, 60000);
            pins.analogSetPeriod(AnalogPin.P16, 60000);
        }

        else if (speed < 300) {
            pins.analogSetPeriod(AnalogPin.P13, 40000);
            pins.analogSetPeriod(AnalogPin.P14, 40000);
            pins.analogSetPeriod(AnalogPin.P15, 40000);
            pins.analogSetPeriod(AnalogPin.P16, 40000);
        }
        else {
            pins.analogSetPeriod(AnalogPin.P13, 30000);
            pins.analogSetPeriod(AnalogPin.P14, 30000);
            pins.analogSetPeriod(AnalogPin.P15, 30000);
            pins.analogSetPeriod(AnalogPin.P16, 30000);
        }
    }

    //% subcategory=RobotBoard  color=#Cfa3FF 
    //% blockId=bot-drive-motor block="drive motor|%motor| %dir | at speed %speed"
    //% weight=85
    //% motor.defl=1
    //% motor.min=1 motor.max=2
    //% speed.min=0 speed.max=1023
    export function driveMotor(motor: number, dir: direction, speed: number): void {
        setPWM(Math.abs(speed));

        if (motor == 1) {
            if (dir == direction.forward) {
                pins.analogWritePin(AnalogPin.P13, speed);
                pins.analogWritePin(AnalogPin.P14, 0);
            } else {
                pins.analogWritePin(AnalogPin.P13, 0);
                pins.analogWritePin(AnalogPin.P14, speed);
            }
        } else if (motor == 2) {
            if (dir == direction.forward) {
                pins.analogWritePin(AnalogPin.P15, 0);
                pins.analogWritePin(AnalogPin.P16, speed);
            } else {
                pins.analogWritePin(AnalogPin.P15, speed);
                pins.analogWritePin(AnalogPin.P16, 0);
            }
        }
    }

    //% subcategory=RobotBoard  color=#Cfa3FF 
    //% blockId=bot-stop-motor block="stop motor %index"
    //% weight=80
    //% motor.defl=1
    //% motor.min=1 motor.max=2
    export function stopMotor(motor: number): void {
        if (motor === 1) {
            pins.analogWritePin(AnalogPin.P13, 0);
            pins.analogWritePin(AnalogPin.P14, 0);
        } else {
            pins.analogWritePin(AnalogPin.P15, 0);
            pins.analogWritePin(AnalogPin.P16, 0);
        }
    }

    //% subcategory=RobotBoard  color=#Cfa3FF 
    //% blockId=bot-stop-all block="stop All motors"
    //% weight=79
    //% blockGap=50
    export function MotorStopAll(): void {
        pins.analogWritePin(AnalogPin.P13, 0);
        pins.analogWritePin(AnalogPin.P14, 0);
        pins.analogWritePin(AnalogPin.P15, 0);
        pins.analogWritePin(AnalogPin.P16, 0);
    }


    /**
    * Read line following sensor
    */
    //% subcategory=RobotBoard  color=#Cfa3FF 
    //% blockId="bot-line-sensor" block="line sensor %lineSen"
    //% weight=10 color=#Cfa3FF 
    export function getLineSensor(lineSen: lineSensor): number {
        let pin: DigitalPin;
        let sensorData: number;
        
        if(lineSen == 0x01){
            sensorData = pinRead(DigitalPin.P0)
        }else if(lineSen == 0x02){
            sensorData = pinRead(DigitalPin.P1)
        }else if(lineSen == 0x03){
            sensorData = pinRead(DigitalPin.P2)
        }else if(lineSen == 0x04){
            pins.setPull(DigitalPin.P3, PinPullMode.PullUp);
            let p3Data: number;
            p3Data = pins.analogReadPin(AnalogPin.P3)
            if (p3Data > 350) {
                sensorData = 0;
            } else {
                sensorData = 1;
            }
        }
        return sensorData;
    }

    export function pinRead(p: DigitalPin): number{
        pins.setPull(p, PinPullMode.PullUp);
        if (pins.digitalReadPin(p) == 0) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
    * Read ultrasonic sensor
    */
    //% subcategory=RobotBoard  color=#Cfa3FF 
    //% blockId="bot-ultrasonic" block="ultrasonic (cm)"
    //% weight=0 color=#Cfa3FF 
    export function getSonar(): number {
        let RangeInCM: number = 0;
        let maxCmDistance: number = 500;
        let trig = DigitalPin.P8;
        let echo = DigitalPin.P9;

        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);
        RangeInCM = d * 153 / 29 / 2 / 100;
        basic.pause(50);
        return Math.round(RangeInCM);
    }
}