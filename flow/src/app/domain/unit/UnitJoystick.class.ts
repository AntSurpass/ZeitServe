import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitJoystickProp extends BaseUnitProp {

}

export class UnitJoystick extends BaseUnit implements UnitJoystickProp {

    constructor(opt: UnitJoystickProp) {
        super();
        this.type = UNIT_TYPE.JOYSTICK;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'joystick.png';
    }

    getCode() {
        return `${ this.name } = units.Joystick(units.PORT${ this.port })\n`;
    }

}
