import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitRelayProp extends BaseUnitProp {

}

export class UnitRelay extends BaseUnit implements UnitRelayProp {
    // hidden = true;
    constructor(opt: UnitRelayProp) {
        super();
        this.type = UNIT_TYPE.RELAY;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'relay.png';
    }

    getCode() {
        return `${ this.name } = units.get(units.relay,units.PORT${ this.port })\n`;
    }

}
