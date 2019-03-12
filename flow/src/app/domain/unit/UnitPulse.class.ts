import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitPulseProp extends BaseUnitProp {

}

export class UnitPulse extends BaseUnit implements UnitPulseProp {
    hidden = true;
    constructor(opt: UnitPulseProp) {
        super();
        this.type = UNIT_TYPE.PULSE;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'pulse.png';
    }

    getCode() {
        return `${ this.name } = units.Pulse(units.PORT${ this.port })\n`;
    }

}