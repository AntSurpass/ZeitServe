import { genComponentId } from "src/app/utils/common-tool";

export interface BaseUnitProp {
    id?: string;
    createTime?: number;
    type?: string;
    name: string;
    port: string;
    icon?: string;
    unitSvg?: any;
}

/** Unit基类 */
export abstract class BaseUnit implements BaseUnitProp{

    /** Unit Id */
    id;

    /** 创建Unit时间戳 */
    createTime;

    /** Unit类型 */
    type;

    /** Unit名称 */
    name;

    /** Unit串口类型 */
    port;

    /** Unit图标 */
    icon;

    /** UnitSvg */
    unitSvg;

    constructor() {
        this.id = genComponentId();
        this.createTime = Date.now();
    }

    /** 生成代码 */
    public abstract getCode();
}