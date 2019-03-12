import * as Utils from '../../utils/common-tool';
import { COMPONENT_ALIAS } from '../../utils/common-data';

export interface BaseProp {
    id?: string;
    type?: string;
    createTime?: number;
    layer?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    componentSvg?: any;
    transformToCode?: () => string;
}

export abstract class BaseComponent implements BaseProp {
    /** 组件ID */
    id: string;

    /** 组件类型 */
    type: string;

    /** 组件创建时间戳 */
    createTime: number;

    /** 组件图层 */
    layer: number;

    /** 组件横坐标 */
    x: number;

    /** 组件纵坐标 */
    y: number;

    width: number;

    height: number;

    constructor(prop: BaseProp) {
        this.id = prop.id || Utils.genComponentId();
        this.createTime = prop.createTime || Date.now();
    }

    /** 获取全部属性 */
    public abstract getAllProps();

    /**
     * 判断是否可更改属性
     * @param key 属性名
     */
    protected checkSettable(key: string) {
        if(key === COMPONENT_ALIAS.ID || key === COMPONENT_ALIAS.TYPE || key === COMPONENT_ALIAS.CREATE_TIME) return false;
        return true;
    }

    /**
     * 获取组件属性
     * @param key 属性名
     */
    public getProp(key?: string) {
        return this[key];
    }

    /**
     * 修改组件属性
     * @param key 属性名
     * @param value 属性值
     */
    public setProp(key: string, value: string | number) {
        if(!this.checkSettable(key)) return;
        if(key === COMPONENT_ALIAS.WIDTH || 
            key === COMPONENT_ALIAS.HEIGHT || 
            key === COMPONENT_ALIAS.X || 
            key === COMPONENT_ALIAS.Y || 
            key === COMPONENT_ALIAS.RADIUS ||
            key === COMPONENT_ALIAS.LAYER) {
                return this[key] = parseInt(<string>value);
        }
        else if(key === COMPONENT_ALIAS.VISIBILITY) {
            return this[key] = value == 'true';
        }
        this[key] = value;
    }

    /** 生成代码 */
    public abstract transformToCode();

    /** 转化颜色字符串格式 */
    protected transformColorStr(color: string): string {
        return color.replace('#', '0x');
    }
}