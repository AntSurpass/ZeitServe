import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitMakeyProp extends BaseUnitProp {

}

export class UnitMakey extends BaseUnit implements UnitMakeyProp {

    constructor(opt: UnitMakeyProp) {
        super();
        this.type = UNIT_TYPE.MAKEY;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'makey.png';
    }

    getCode() {
        return `${ this.name } = units.Makey(units.PORT${ this.port })\n`;
    }

}