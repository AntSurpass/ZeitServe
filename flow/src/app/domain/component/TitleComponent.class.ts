import { BaseComponent, BaseProp } from './BaseComponent.class';
import { COMPONENT_ALIAS, TYPE_ALIAS } from '../../utils/common-data';

/**
 * 标题组件属性
 */
export interface TitleProp extends BaseProp {
    name: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
    backgroundColor?: string;
    text?: string;
    layer: number;
}

/**
 * 标题组件
 */
export class TitleComponent extends BaseComponent implements TitleProp {

    /** 组件名 */
    name = 'title';

    /** X坐标 */
    x = 0;

    /** Y坐标 */
    y = 0;

    /** 宽 */
    width = 320;

    /** 高 */
    height = 20;

    /** 字体颜色 */
    color = '#FFFFFF';

    /** 背景颜色 */
    backgroundColor = '#0000FF';

    /** 标题文本 */
    text = 'Title';

    /** 组件Svg对象 */
    componentSvg = null;

    constructor(prop: TitleProp) {
        super(prop);
        this.type = TYPE_ALIAS.TITLE;
        this.name = prop.name;
        this.layer = prop.layer;
        this.x = prop.x || 0;
        this.y = prop.y || 0;
        this.width = prop.width || 320;
        this.height = prop.height || 20;
        this.color = prop.color || '#FFFFFF';
        this.backgroundColor = prop.backgroundColor || '#0000FF';
        this.text = prop.text || 'Title';
        this.componentSvg = prop.componentSvg || null;
    }

    getAllProps() {
        return [
            { [COMPONENT_ALIAS.ID]: this.id },
            { [COMPONENT_ALIAS.CREATE_TIME]: this.createTime },
            { [COMPONENT_ALIAS.TYPE]: this.type },
            { [COMPONENT_ALIAS.NAME]: this.name },
            { [COMPONENT_ALIAS.COLOR]: this.color },
            { [COMPONENT_ALIAS.BACKGROUND_COLOR]: this.backgroundColor },
            { [COMPONENT_ALIAS.TEXT]: this.text },
            { [COMPONENT_ALIAS.LAYER]: this.layer },
        ];
    }

    transformToCode() {
        return `${this.name} = M5Title(title="${this.text}", fgcolor=${this.transformColorStr(this.color)}, bgcolor=${this.transformColorStr(this.backgroundColor)})\n`;
    }

}