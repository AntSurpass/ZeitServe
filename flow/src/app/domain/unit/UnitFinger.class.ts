import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitFingerProp extends BaseUnitProp {

}

export class UnitFinger extends BaseUnit implements UnitFingerProp {
    // hidden = true;
    constructor(opt: UnitFingerProp) {
        super();
        this.type = UNIT_TYPE.FINGER;
        this.name = opt.name;
        this.port = opt.port || PORT.C;
        this.icon = 'finger.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.finger,units.PORT${ this.port })\n`;
    }
}
