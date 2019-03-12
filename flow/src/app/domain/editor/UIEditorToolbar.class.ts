interface IToolItem {
    /** 图标 */
    icon: string;

    /** 构造器 */
    builder: any;
}

/**
 * 工具项类
 */
export class ToolItem implements IToolItem {
    
    icon = '';

    builder = null;

    constructor(obj: IToolItem) {
        this.icon = obj.icon;
        this.builder = obj.builder;
    }

}

/**
 * 工具栏类
 */
export class ToolBar {

    /** 工具项数组 */
    toolList: ToolItem[] = [];

    constructor(toolList: ToolItem[]) {
        this.toolList = toolList;
    }

}