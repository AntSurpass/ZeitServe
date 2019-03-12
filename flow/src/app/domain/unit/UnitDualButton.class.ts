import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitDualBUTTONProp extends BaseUnitProp {

}

export class UnitDualButton extends BaseUnit implements UnitDualBUTTONProp {
    // hidden = true;
    constructor(opt: UnitDualBUTTONProp) {
        super();
        this.type = UNIT_TYPE.DUALBUTTON;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'dualbutton.png';
    }

    getCode() {
        return `${ this.name} = units.get(units.dual_button,units.PORT${ this.port })\n`;
    }

}
    