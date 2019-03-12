import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitRfidProp extends BaseUnitProp {

}

export class UnitRfid extends BaseUnit implements UnitRfidProp {
    // hidden = true;
    constructor(opt: UnitRfidProp) {
        super();
        this.type = UNIT_TYPE.RFID;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'rfid.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.rfid,units.PORT${ this.port })\n`;
    }

}
