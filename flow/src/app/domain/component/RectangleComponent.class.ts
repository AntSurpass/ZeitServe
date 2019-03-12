import { BaseComponent, BaseProp } from './BaseComponent.class';
import { COMPONENT_ALIAS, TYPE_ALIAS } from '../../utils/common-data';

export interface RectangleProp extends BaseProp {
    name: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    borderColor?: string;
    backgroundColor?: string;
    layer: number;
    eretio?: number;
}

export class RectangleComponent extends BaseComponent implements RectangleProp {

    /** 组件名 */
    name = 'rectangle';

    /** X坐标 */
    x = 0;
    
    /** Y坐标 */
    y = 0;

    /** 宽 */
    width = 30;

    /** 宽 */
    height = 30;

    /** 边框颜色 */
    borderColor = '#FFFFFF';

    /** 填充颜色 */
    backgroundColor = '#FFFFFF';

    /** 组件Svg对象 */
    componentSvg = null;

    /** 等比系数 */
    eRetio = 1;

    constructor(prop: RectangleProp) {
        super(prop);
        this.type = TYPE_ALIAS.RECTANGLE;
        this.name = prop.name;
        this.eRetio = prop.eretio;
        this.layer = prop.layer;
        this.x = Math.floor(prop.x) || 0;
        this.y = Math.floor(prop.y ) || 0;
        this.width = Math.floor(prop.width) || 30;
        this.height = Math.floor(prop.height) || 30;
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
            { [COMPONENT_ALIAS.WIDTH]: this.width },
            { [COMPONENT_ALIAS.HEIGHT]: this.height },
            { [COMPONENT_ALIAS.BORDER_COLOR]: this.borderColor },
            { [COMPONENT_ALIAS.BACKGROUND_COLOR]: this.backgroundColor },
            { [COMPONENT_ALIAS.LAYER]: this.layer },
        ];
    }

    transformToCode() {
        // tslint:disable-next-line:max-line-length
        return `${this.name} = M5Rect(${Math.floor(this.x)}, ${Math.floor(this.y)}, ${Math.floor(this.width)}, ${Math.floor(this.height)}, ${this.transformColorStr(this.backgroundColor)}, ${this.transformColorStr(this.borderColor)})\n`;
    }
}
