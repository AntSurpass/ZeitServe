import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitAngleProp extends BaseUnitProp {

}

export class UnitAngle extends BaseUnit implements UnitAngleProp {
    stickType = 'stick';
    constructor(opt: UnitAngleProp) {
        super();
        this.type = UNIT_TYPE.ANGLE;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'angle.png';
    }

    getCode() {
        return `${ this.name } = units.ANGLE(units.PORT${ this.port })\n`;
    }

}