import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitDacProp extends BaseUnitProp {

}

export class UnitDac extends BaseUnit implements UnitDacProp {
    // hidden = true;
    constructor(opt: UnitDacProp) {
        super();
        this.type = UNIT_TYPE.DAC;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'dac.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.dac,units.PORT${ this.port })\n`;
    }

}
