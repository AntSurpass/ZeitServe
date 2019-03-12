import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitColorProp extends BaseUnitProp {

}

export class UnitColor extends BaseUnit implements UnitColorProp {
    // hidden = true;
    constructor(opt: UnitColorProp) {
        super();
        this.type = UNIT_TYPE.COLOR;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'color.png';
    }

    getCode() {
        return  `${ this.name } = units.get(units.color,units.PORT${ this.port })\n`;
    }

}
