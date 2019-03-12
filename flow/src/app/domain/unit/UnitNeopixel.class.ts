import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitNeopixelProp extends BaseUnitProp {
    count: number;
}

export class UnitNeopixel extends BaseUnit implements UnitNeopixelProp {

    /** Neopixel灯数量 */
    count = 10;

    constructor(opt: UnitNeopixelProp) {
        super();
        this.type = UNIT_TYPE.NEOPIXEL;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.count = opt.count || 10;
        this.icon = 'neopixel.png';
    }

    getCode() {
        return `${ this.name } = units.RGB_Multi(units.PORT${ this.port }, ${ this.count })\n`;
    }

}