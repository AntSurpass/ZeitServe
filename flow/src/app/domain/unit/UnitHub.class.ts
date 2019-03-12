import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitHubProp extends BaseUnitProp {

}

export class UnitHub extends BaseUnit implements UnitHubProp {
    hidden = true;
    constructor(opt: UnitHubProp) {
        super();
        this.type = UNIT_TYPE.HUB;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'hub.png';
    }

    getCode() {
    }

}
