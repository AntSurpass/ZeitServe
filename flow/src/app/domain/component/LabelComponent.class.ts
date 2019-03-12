import { BaseComponent, BaseProp } from './BaseComponent.class';
import { COMPONENT_ALIAS, FONT_ALIAS, TYPE_ALIAS } from '../../utils/common-data';

export interface LabelProp extends BaseProp {
    name: string;
    x?: number;
    y?: number;
    color?: string;
    text?: string;
    font?: string;
    layer: number;
    eretio?: number;
}

export class LabelComponent extends BaseComponent implements LabelProp {

    /** 组件名 */
    name = 'label';

    /** X坐标 */
    x = 0;

    /** Y坐标 */
    y = 0;

    /** 字体颜色 */
    color = '#FFFFFF';

    /** 标题文本 */
    text = 'Text';

    /** 文本字体 */
    font = FONT_ALIAS.DEFAULT;

    /** 组件Svg对象 */
    componentSvg = null;

        /** 等比系数 */
        eRetio = 1;

    constructor(prop: LabelProp) {
        super(prop);
        this.type = TYPE_ALIAS.LABEL;
        this.name = prop.name;
        this.eRetio = prop.eretio;
        this.layer = prop.layer;
        this.x = Math.floor(prop.x) || 0;
        this.y = Math.floor(prop.y) || 0;
        this.color = prop.color || '#FFFFFF';
        this.text = prop.text || 'Text';
        this.font = prop.font || FONT_ALIAS.DEFAULT;
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
            { [COMPONENT_ALIAS.COLOR]: this.color },
            { [COMPONENT_ALIAS.TEXT]: this.text },
            { [COMPONENT_ALIAS.FONT]: this.font },
            { [COMPONENT_ALIAS.LAYER]: this.layer },
        ];
    }

    transformToCode() {
        // tslint:disable-next-line:max-line-length
        return `${this.name} = M5TextBox(${Math.floor(this.x)}, ${Math.floor(this.y)}, "${this.text}", ${this.font}, ${this.transformColorStr(this.color)})\n`;
    }

}