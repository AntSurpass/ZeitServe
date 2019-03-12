import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitCardKbProp extends BaseUnitProp {

}

export class UnitCardkb extends BaseUnit implements UnitCardKbProp {

    constructor(opt: UnitCardKbProp) {
        super();
        this.type = UNIT_TYPE.CARDKB;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'cardkb.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.cardKB,units.PORT${ this.port })\n`;
    }

}
