import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitPIRProp extends BaseUnitProp {

}

export class UnitPIR extends BaseUnit implements UnitPIRProp {

    constructor(opt: UnitPIRProp) {
        super();
        this.type = UNIT_TYPE.PIR;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'pir.png';
    }

    getCode() {
        return `${ this.name } = units.PIR(units.PORT${ this.port })\n`;
    }

}