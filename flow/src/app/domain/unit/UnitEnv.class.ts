import { BaseUnit, BaseUnitProp } from './BaseUnit.class';
import { PORT, UNIT_TYPE } from 'src/app/utils/common-data';

export interface UnitEnvProp extends BaseUnitProp {

}

export class UnitEnv extends BaseUnit implements UnitEnvProp {

    constructor(opt: UnitEnvProp) {
        super();
        this.type = UNIT_TYPE.ENV;
        this.name = opt.name;
        this.port = opt.port || PORT.A;
        this.icon = 'env.png';
    }

    getCode() {
        return `${ this.name } = units.ENV(units.PORT${ this.port })\n`;
    }

}