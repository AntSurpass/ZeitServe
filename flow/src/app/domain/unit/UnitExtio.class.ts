import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitExtioProp extends BaseUnitProp {

}

export class UnitExtio extends BaseUnit implements UnitExtioProp {

    constructor(opt: UnitExtioProp) {
        super();
        this.type = UNIT_TYPE.EXTIO;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'extio.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.ext_io,units.PORT${ this.port })\n`;
    }

}