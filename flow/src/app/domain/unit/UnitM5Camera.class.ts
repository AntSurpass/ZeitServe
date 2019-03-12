import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitM5CameraProp extends BaseUnitProp {

}

export class UnitM5Camera extends BaseUnit implements UnitM5CameraProp {
    hidden = true;
    constructor(opt: UnitM5CameraProp) {
        super();
        this.type = UNIT_TYPE.M5CAMEAR;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'm5camera.png';
    }

    getCode() {
    }

}
