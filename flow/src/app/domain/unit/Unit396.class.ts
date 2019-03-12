import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface Unit396Prop extends BaseUnitProp {

}

export class Unit396 extends BaseUnit implements Unit396Prop {
    hidden = true;
    constructor(opt: Unit396Prop) {
        super();
        this.type = UNIT_TYPE.TPNX;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = '3.96.png';
    }

    getCode() {
    }

}
