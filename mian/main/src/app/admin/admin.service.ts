import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { HttpRequest } from '@angular/common/http';

export interface LoginInfo {
  username: string;
  password: string;
}

export interface News {
  title: string;
  type: number;
  published: boolean;
  create_time: string;
  last_modified_time: string;
  html?: string;
  newsId: string;
  cover: string;
}

export interface Product {
  title: string;
  type: number;
  published: boolean;
  create_time: string;
  last_modified_time: string;
  html?: string;
  productId: string;
  cover: string;
}

export interface Message {
  msgId: string;
  name: string;
  email: string;
  message: string;
  datetime: string;
}

export interface Video {
  title: string;
  cover: string;
  youku: string;
  youtube: string;
  published: boolean;
  videoId?: string; 
}

interface LoginResponse {
  code: number,
  data: any[]
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: Http) { }

  login(userInfo: LoginInfo) {
    return this.http.post(`${ environment.apiUrl }/admin/login`, userInfo);
  }

  addNews(news) {
    return this.http.post(`${ environment.apiUrl }/admin/news/${ news.title }`, news);
  }

  updateNews(news: News) {
    return this.http.put(`${ environment.apiUrl }/admin/news/${ news.newsId }`, news);
  }

  getNewsList() {
    return this.http.get(`${ environment.apiUrl }/admin/news`);
  }

  getNewsById(id) {
    return this.http.get(`${ environment.apiUrl }/admin/news/${ id }`);
  }

  publishedNews(id) {
    return this.http.put(`${ environment.apiUrl }/admin/news/${id}/published/1`, {});
  }

  cancelPublishedNews(id) {
    return this.http.put(`${ environment.apiUrl }/admin/news/${id}/published/0`, {});
  }

  deleteNewsById(id) {
    return this.http.delete(`${ environment.apiUrl }/admin/news/${ id }`);
  }

  addProduct(product) {
    return this.http.post(`${ environment.apiUrl }/admin/product/${ product.title }`, product);
  }

  updateProduct(product: Product) {
    return this.http.put(`${ environment.apiUrl }/admin/product/${ product.productId }`, product);
  }

  getProductList() {
    return this.http.get(`${ environment.apiUrl }/admin/product`);
  }

  getProductById(id) {
    return this.http.get(`${ environment.apiUrl }/admin/product/${ id }`);
  }

  publishedProduct(id) {
    return this.http.put(`${ environment.apiUrl }/admin/product/${ id }/published/1`, {});
  }

  cancelPublishedProduct(id) {
    return this.http.put(`${ environment.apiUrl }/admin/product/${ id }/published/0`, {});
  }

  deleteProductById(id) {
    return this.http.delete(`${ environment.apiUrl }/admin/product/${ id }`);
  }

  getMessageList() {
    return this.http.get(`${ environment.apiUrl }/admin/message`);
  }

  uploadImg(type, file) {
    let fd = new FormData();
    fd.append('img', file);
    return this.http.post(`${ environment.apiUrl }/admin/upload/image/${ type }`, fd);
  }

  updateImg(type, name, file) {
    let fd = new FormData();
    fd.append('img', file);
    return this.http.post(`${ environment.apiUrl }/admin/update/image/${ type }/${ name }`, fd);
  }

  deleteImg(type, name) {
    return this.http.delete(`${ environment.apiUrl }/admin/update/image/${ type }/${ name }`);
  }

  getImageList(type) {
    return this.http.get(`${ environment.apiUrl }/admin/image/${ type }/name`);
  }

  getVideoList() {
    return this.http.get(`${ environment.apiUrl }/admin/video`);
  }

  addVideo(video: Video) {
    return this.http.post(`${ environment.apiUrl }/admin/video`, video);
  }

  updateVideo(video) {
    return this.http.put(`${ environment.apiUrl }/admin/video/${ video.videoId }`, video);
  }

  deleteVideo(id) {
    return this.http.delete(`${ environment.apiUrl }/admin/video/${ id }`);
  }

  publishedVideo(id) {
    return this.http.put(`${ environment.apiUrl }/admin/video/${ id }/published/1`, {});
  }

  cancelPublishedVideo(id) {
    return this.http.put(`${ environment.apiUrl }/admin/video/${ id }/published/0`, {});
  }

  getVideoById(id) {
    return this.http.get(`${ environment.apiUrl }/admin/video/${ id }`);
  }
}
