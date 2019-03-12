import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitWeighProp extends BaseUnitProp {

}

export class UnitWeigh extends BaseUnit implements UnitWeighProp {

    constructor(opt: UnitWeighProp) {
        super();
        this.type = UNIT_TYPE.WEIGH;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'weigh.png';
    }

    getCode() {
        return `${ this.name } = units.Weigh(units.PORT${ this.port })\n`;
    }

}