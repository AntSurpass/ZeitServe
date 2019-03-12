/**
 * 新闻
 */
export interface AllNews {
    code: number;
    data: Array<News>;
}

export interface NewsItem {
    code: number;
    data: News;
}

export interface News {
    newsId: string;
    title: string;
    type: number;
    published: boolean;
    create_time: string;
    last_modified_time: string;
    cover: string;
    html?: string;
}

/**
 * 产品
 */
export interface AllProducts {
    code: number;
    data: Array<Products>;
}

export interface ProductItem {
    code: number;
    data: Products;
}
export interface Products {
    productId: string;
    title: string;
    type: number;
    published: boolean;
    create_time: string;
    last_modified_time: string;
    cover: string;
    html?: string;
}

/**
 * 视频
 */
export interface VideoList {
    code: number;
    data: VideoItem[];

}
export interface VideoItem {
    videoId: string;
    title: string;
    published: boolean;
    youku: string;
    youtube: string;
    cover: string;
}
/**
 * 图片列表
 */
export interface ImageList {
    code: number;
    data: string[];
}
/**
 * 留言
 */
export interface Message {
    code: number;
    data: void[];
}

