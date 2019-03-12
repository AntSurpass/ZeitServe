import { BaseComponent, BaseProp } from './BaseComponent.class';
import { COMPONENT_ALIAS, TYPE_ALIAS } from '../../utils/common-data';

export interface ImageProp extends BaseProp {
    name: string;
    x: number;
    y: number;
    imagePath?: string;
    visibility?: boolean;
    layer: number;
}

export class ImageComponent extends BaseComponent implements ImageProp {

    /** 组件名 */
    name = 'image';

    /** X坐标 */
    x = 0;

    /** Y坐标 */
    y = 0;

    /** 图片路径 */
    imagePath = 'default.jpg';

    /** 可见性 */
    visibility = true;

    /** 组件Svg对象 */
    componentSvg = null;

    constructor(prop: ImageProp) {
        super(prop);
        this.type = TYPE_ALIAS.IMAGE;
        this.name = prop.name;
        this.layer = prop.layer;
        this.x = Math.floor(prop.x) || 0;
        this.y = Math.floor(prop.y) || 0;
        this.imagePath = prop.imagePath || 'default.jpg';
        this.visibility = prop.visibility || true;
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
            { [COMPONENT_ALIAS.IMAGE_PATH]: this.imagePath },
            { [COMPONENT_ALIAS.VISIBILITY]: this.visibility },
            { [COMPONENT_ALIAS.LAYER]: this.layer },
        ];
    }

    transformToCode() {
        return `${this.name} = M5Img(${this.x}, ${this.y}, "res/${this.imagePath}", ${this.visibility ? 'True' : 'False'})\n`;
    }

}