import { BaseComponent, BaseProp } from './BaseComponent.class';
import { COMPONENT_ALIAS, TYPE_ALIAS } from '../../utils/common-data';

export interface ScreenProp extends BaseProp {
    backgroundImage?: string;
    backgroundColor?: string;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export class ScreenComponent extends BaseComponent implements ScreenProp {

    /** 名称 */
    name = 'Screen';

    /** X坐标 */
    x = 0;

    /** Y坐标 */
    y = 0;

    /** 宽 */
    width = 320;

    /** 高 */
    height = 240;

    /** 背景色 */
    backgroundColor = '#111111';

    /** 背景图 */
    backgroundImage = '';

    /** 组件Svg */
    componentSvg = null;

    constructor(prop?: ScreenProp) {
        super(prop);
        this.id = '____screen';
        this.type = TYPE_ALIAS.SCREEN;
        this.x = prop.x || 0;
        this.y = prop.y || 0;
        this.width = prop.width || 320;
        this.height = prop.height || 240;
        this.backgroundColor = prop.backgroundColor || '#111111';
        this.backgroundImage = prop.backgroundImage || '';
        this.componentSvg = prop.componentSvg || null;
    }

    getAllProps() {
        return [
            { [COMPONENT_ALIAS.BACKGROUND_COLOR]: this.backgroundColor },
            // { [COMPONENT_ALIAS.BACKGROUND_IMAGE]: this.backgroundImage }
        ];
    }

    transformToCode() {
        // return `clear_bg(${this.transformColorStr(this.backgroundColor)})\n`;
        return ``;
    }

}