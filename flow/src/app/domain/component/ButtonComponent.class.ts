import { BaseComponent, BaseProp } from './BaseComponent.class';
import { COMPONENT_ALIAS, TYPE_ALIAS } from '../../utils/common-data';

export enum ButtonIndex {
    A,
    B,
    C
}

export interface ButtonProp extends BaseProp {
    name: string;
    buttonIndex?: ButtonIndex;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    text?: string;
    visibility?: boolean;
}

export class ButtonComponent extends BaseComponent implements ButtonProp {

    /** 组件名 */
    name = 'button';

    /** 按钮索引 */
    buttonIndex = ButtonIndex.A;

    /** X坐标 */
    x = 105;

    /** Y坐标 */
    y = 381;

    /** 宽 */
    width = 64;
    
    /** 高 */
    height = 24;

    /** 文本 */
    text = 'Button';

    /** 可见性 */
    visibility = false;

    /** 组件Svg */
    componentSvg = null;
    
    constructor(prop: ButtonProp) {
        super(prop);
        this.type = TYPE_ALIAS.BUTTON;
        this.buttonIndex = prop.buttonIndex;
        this.name = prop.name;
        switch(prop.buttonIndex) {
            case ButtonIndex.A:
                this.id = '____buttonA';
                this.name = 'ButtonA';
                this.text = prop.text || 'ButtonA';
                this.x = 35;
                this.y = 216;
                break;
            case ButtonIndex.B:
                this.id = '____buttonB';
                this.name = 'ButtonB';
                this.text = prop.text || 'ButtonB';
                this.x = 125;
                this.y = 216;
                break;
            case ButtonIndex.C:
                this.id = '____buttonC';
                this.name = 'ButtonC';
                this.text = prop.text || 'ButtonC';
                this.x = 215;
                this.y = 216;
                break;
            default:
                return;
        }
        this.visibility = prop.visibility || false;
        this.componentSvg = prop.componentSvg || null;
    }

    getAllProps() {
        return [
            { [COMPONENT_ALIAS.TEXT]: this.text },
            { [COMPONENT_ALIAS.VISIBILITY]: this.visibility }
        ];
    }

    transformToCode() {
        let btnName = '';
        switch(this.name) {
            case 'ButtonA':
                btnName = 'btnA';
                break;
            case 'ButtonB':
                btnName = 'btnB';
                break;
            case 'ButtonC':
                btnName = 'btnC';
                break;
        }
        return `${btnName} = M5Button(name="${this.name}", text="${this.text}", visibility=${this.visibility ? 'True' : 'False'})\n`;
    }

}