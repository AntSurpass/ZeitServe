import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitTofProp extends BaseUnitProp {

}

export class UnitTOF extends BaseUnit implements UnitTofProp {
    // hidden = true;
    stickNone = 'stick';
    constructor(opt: UnitTofProp) {
        super();
        this.type = UNIT_TYPE.TOF;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'tof.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.tof,units.PORT${ this.port })\n`;
    }

}
