import { BaseComponent, BaseProp } from './BaseComponent.class';
import { COMPONENT_ALIAS, TYPE_ALIAS } from '../../utils/common-data';

export interface CircleProp extends BaseProp {
    name: string;
    x: number;
    y: number;
    radius?: number;
    borderColor?: string;
    backgroundColor?: string;
    layer: number;
}

export class CircleComponent extends BaseComponent implements CircleProp {

    /** 组件名 */
    name = 'circle';

    /** X坐标 */
    x = 0;

    /** Y坐标 */
    y = 0;

    /** 半径 */
    radius = 15;

    /** 边框颜色 */
    borderColor = '#FFFFFF';

    /** 填充颜色 */
    backgroundColor = '#FFFFFF';

    /** 组件Svg对象 */
    componentSvg = null;

    constructor(prop: CircleProp) {
        super(prop);
        this.type = TYPE_ALIAS.CIRCLE;
        this.name = prop.name;
        this.layer = prop.layer;
        this.x = Math.floor(prop.x) || 0;
        this.y = Math.floor(prop.y) || 0;
        this.radius = Math.floor(prop.radius) || 15;
        this.borderColor = prop.borderColor || '#FFFFFF';
        this.backgroundColor = prop.backgroundColor || '#FFFFFF';
        this.componentSvg = prop.componentSvg || null;
    }

    getAllProps() {
        return [
            { [COMPONENT_ALIAS.ID]: this.id },
            { [COMPONENT_ALIAS.CREATE_TIME]: this.createTime },
            { [COMPONENT_ALIAS.TYPE]: this.type },
            { [COMPONENT_ALIAS.NAME]: this.name },
            { [COMPONENT_ALIAS.X]: this.x },
            { [COMPONENT_ALIAS.Y]: this.y },
            { [COMPONENT_ALIAS.RADIUS]: this.radius },
            { [COMPONENT_ALIAS.BORDER_COLOR]: this.borderColor },
            { [COMPONENT_ALIAS.BACKGROUND_COLOR]: this.backgroundColor },
            { [COMPONENT_ALIAS.LAYER]: this.layer },
        ];
    }

    transformToCode() {
        return `${this.name} = M5Circle(${this.x}, ${this.y}, ${this.radius}, ${this.transformColorStr(this.backgroundColor)}, ${this.transformColorStr(this.borderColor)})\n`;
    }

}