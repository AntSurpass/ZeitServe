import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitEarthProp extends BaseUnitProp {

}

export class UnitEarth extends BaseUnit implements UnitEarthProp {
    stickType = 'stick';
    constructor(opt: UnitEarthProp) {
        super();
        this.type = UNIT_TYPE.EARTH;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'earth.png';
    }

    getCode() {
        return `${ this.name } = units.Earth(units.PORT${ this.port })\n`;
    }

}