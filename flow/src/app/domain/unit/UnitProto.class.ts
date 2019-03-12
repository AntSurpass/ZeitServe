import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitProtoProp extends BaseUnitProp {

}

export class UnitProto extends BaseUnit implements UnitProtoProp {
    hidden = true;
    constructor(opt: UnitProtoProp) {
        super();
        this.type = UNIT_TYPE.PROTO;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'proto.png';
    }

    getCode() {
    }

}
