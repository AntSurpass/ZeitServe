import { Injectable } from '@angular/core';
import { AllNews, NewsItem, AllProducts, ProductItem, VideoList, Message, ImageList } from '../common/interface/store';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) {

  }
  /**
   * 新闻列表
   */
  getNews() {
    return this.http.get<AllNews>(`${environment.apiUrl}/news`);
  }
  /**
   * @param id 新闻id
   */
  getNewsItem(id: string) {
    return this.http.get<NewsItem>(`${environment.apiUrl}/news/${id}`);
  }
  /**
   * 产品列表
   */
  getProducts() {
    return this.http.get<AllProducts>(`${environment.apiUrl}/product`);
  }
  /**
   * @param id 产品id
   */
  getProductsItem(id: string) {
    return this.http.get<ProductItem>(`${environment.apiUrl}/product/${id}`);
  }
  /**
   * 视频列表
   */
  getVideos() {
    return this.http.get<VideoList>(`${environment.apiUrl}/video`);
  }

  /**
   * @param type  图片类型 case: 案例图片  brand: 商标图片
   */
  getImages(type) {
    return this.http.get<ImageList>(`${environment.apiUrl}/image/${type}/name`);
  }
  /**
   * 留言
   */
  addMessage(data) {
    return this.http.post<Message>(`${environment.apiUrl}/message`, data);
  }
}
