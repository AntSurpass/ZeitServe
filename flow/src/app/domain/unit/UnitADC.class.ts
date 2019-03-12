import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitADCProp extends BaseUnitProp {

}

export class UnitADC extends BaseUnit implements UnitADCProp {
    // hidden = true
    constructor(opt: UnitADCProp) {
        super();
        this.type = UNIT_TYPE.ADC;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'adc.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.adc,units.PORT${ this.port })\n`;
    }

}
