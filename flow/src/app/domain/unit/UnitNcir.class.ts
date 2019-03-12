import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitNcirProp extends BaseUnitProp {

}

export class UnitNicr extends BaseUnit implements UnitNcirProp {
    // hidden = true;
    constructor(opt: UnitNcirProp) {
        super();
        this.type = UNIT_TYPE.NCIR;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'ncir.png';
    }

    getCode() {
        return `${this.name} = units.get(units.ncir,units.PORT${this.port})\n`;
    }
}
