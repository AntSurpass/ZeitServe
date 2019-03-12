import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitLidarCarProp extends BaseUnitProp {

}

export class UnitLidarCar extends BaseUnit implements UnitLidarCarProp {

    constructor(opt: UnitLidarCarProp) {
        super();
        this.type = UNIT_TYPE.LIDARCAR;
        this.name = opt.name;
        this.port = opt.port || PORT.B;
        this.icon = 'joystick.png';
    }

    getCode() {
        return `${ this.name } = units.LidarCar(units.PORT${ this.port })\n`;
    }

}
