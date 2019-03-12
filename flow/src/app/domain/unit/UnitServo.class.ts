import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitServoProp extends BaseUnitProp {

}

export class UnitServo extends BaseUnit implements UnitServoProp {

    constructor(opt: UnitServoProp) {
        super();
        this.type = UNIT_TYPE.SERVO;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'servo.png';
    }

    getCode() {
        return `${ this.name } = units.Servo(units.PORT${ this.port })\n`;
    }

}