import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitThermalProp extends BaseUnitProp {

}

export class UnitThermal extends BaseUnit implements UnitThermalProp {
    hidden = true;
    constructor(opt: UnitThermalProp) {
        super();
        this.type = UNIT_TYPE.THERMAL;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'thermal.png';
    }

    getCode() {
    }

}
