import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitBUTTONProp extends BaseUnitProp {

}

export class UnitButton extends BaseUnit implements UnitBUTTONProp {
    // hidden = true;
    constructor(opt: UnitBUTTONProp) {
        super();
        this.type = UNIT_TYPE.BUTTON;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'button.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.button,units.PORT${ this.port })\n`;
    }

}
