import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitRGBProp extends BaseUnitProp {

}

export class UnitRGB extends BaseUnit implements UnitRGBProp {
    // hidden = true;
    constructor(opt: UnitRGBProp) {
        super();
        this.type = UNIT_TYPE.RGB;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'rgb.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.rgb,units.PORT${ this.port }, 3)\n`;
    }

}
