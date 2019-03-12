import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitIRProp extends BaseUnitProp {

}

export class UnitIR extends BaseUnit implements UnitIRProp {
    // hidden = true;
    constructor(opt: UnitIRProp) {
        super();
        this.type = UNIT_TYPE.IR;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'ir.png';
    }

    getCode() {
        return `${this.name} = units.get(units.ir,units.PORT${this.port})\n`;
    }
}


