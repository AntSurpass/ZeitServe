import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitTrackProp extends BaseUnitProp {

}

export class UnitTrack extends BaseUnit implements UnitTrackProp {

    constructor(opt: UnitTrackProp) {
        super();
        this.type = UNIT_TYPE.TRACK;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'track.png';
    }

    getCode() {
        return `${ this.name } = units.Tracker(units.PORT${ this.port })\n`;
    }

}
