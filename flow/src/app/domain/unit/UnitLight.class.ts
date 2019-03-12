import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitLightProp extends BaseUnitProp {

}

export class UnitLight extends BaseUnit implements UnitLightProp {
    stickType = 'stick';
    constructor(opt: UnitLightProp) {
        super();
        this.type = UNIT_TYPE.LIGHT;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'light.png';
    }

    getCode() {
        return `${ this.name } = units.Light(units.PORT${ this.port })\n`;
    }

}