import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor(private http: HttpClient, private router: Router) {}

    private authErrorHandler<T>() {
        return map((resData: ResponseData<T>) => {
            if(resData.code === -100) {
                sessionStorage.removeItem('m5-token');
                this.router.navigateByUrl('/');
            }
            else if(resData.code === -1) {

            }
            else if(resData.code === 0) {

            }
            return resData;
        });
    }

    private setTokenHeader() {
        if(sessionStorage.getItem('m5-token') != null) {
            return {
                'm5-token': sessionStorage.getItem('m5-token')
            };
        }
        return {};
    }

    login(payload: LoginInfo) {
        return this.http.post<{code: number, data: string}>(`${environment.apiUrl}/login`, payload).pipe();
    }

    getMessages() {
        return this.http.get<ResponseData<Message[]>>(`${environment.apiUrl}/message`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    getProducts() {
        return this.http.get<ResponseData<Product[]>>(`${environment.apiUrl}/product`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    getCount() {
        return this.http.get<ResponseData<Count>>(`${environment.apiUrl}/statistic/data/`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    getProductById(id) {
        return this.http.get<ResponseData<Product>>(`${environment.apiUrl}/product/${id}`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }



    addProduct(product: ProductForm) {
        return this.http.post<ResponseData<any[]>>(`${environment.apiUrl}/product`, product, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    removeProduct(id) {
        return this.http.delete<ResponseData<any[]>>(`${environment.apiUrl}/product/${id}`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    updateProduct(product: Product) {
        return this.http.put<ResponseData<any[]>>(`${environment.apiUrl}/product/${product.productId}`, product, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    updateProductPublishedStatus(id, status) {
        return this.http.put<ResponseData<any[]>>(`${environment.apiUrl}/product/${id}/published/${status}`, {}, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    getNews() {
        return this.http.get<ResponseData<News[]>>(`${environment.apiUrl}/news`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    getNewsById(id) {
        return this.http.get<ResponseData<News>>(`${environment.apiUrl}/news/${id}`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    addNews(news: NewsForm) {
        return this.http.post<ResponseData<any[]>>(`${environment.apiUrl}/news`, news, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    removeNews(id) {
        return this.http.delete<ResponseData<any[]>>(`${environment.apiUrl}/news/${id}`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    updateNews(news: News) {
        return this.http.put<ResponseData<any[]>>(`${environment.apiUrl}/news/${news.newsId}`, news, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    updateNewsPublishedStatus(id, status) {
        return this.http.put<ResponseData<any[]>>(`${environment.apiUrl}/news/${id}/published/${status}`, {}, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    getVideos() {
        return this.http.get<ResponseData<Video[]>>(`${environment.apiUrl}/video`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    getVideoById(id) {
        return this.http.get<ResponseData<Video>>(`${environment.apiUrl}/video/${id}`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    addVideo(video: VideoForm) {
        return this.http.post<ResponseData<any[]>>(`${environment.apiUrl}/video`, video, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    removeVideo(id) {
        return this.http.delete<ResponseData<any[]>>(`${environment.apiUrl}/video/${id}`, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    updateVideo(video: Video) {
        return this.http.put<ResponseData<any[]>>(`${environment.apiUrl}/video/${video.videoId}`, video, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

    updateVideoPublishedStatus(id, status) {
        return this.http.put<ResponseData<any[]>>(`${environment.apiUrl}/video/${id}/published/${status}`, {}, { headers: this.setTokenHeader() }).pipe(
            this.authErrorHandler()
        );
    }

}

export interface LoginInfo {
    username: string;
    password: string;
}

export interface Message {
    msgId: string;
    email: string;
    name: string;
    message: string;
    datetime: string;
}

export interface Product {
    productId: string;
    title: string;
    type: number;
    published: boolean;
    create_time: string;
    last_modified_time: string;
    cover: string;
    buy_link: string;
    doc_link: string;
}


export interface Count {
    home_total_views: number;
    doc_total_views: number;
    uiflow_total_users: number;
    uiflow_online_users: number;
    home_daily_views: number[];
    home_monthly_views: number[];
    doc_daily_views: number[];
    doc_monthly_views: number[];
    uiflow_daily_users: number[];
    uiflow_monthly_users: number[];
}

export interface ProductForm {
    title: string;
    type: number;
    published: boolean;
    cover: string;
    buy_link: string;
    doc_link: string;
}

export interface News {
    newsId: string;
    title: string;
    description: string;
    type: number;
    published: boolean;
    create_time: string;
    last_modified_time: string;
    cover: string;
    link: string;
    tab: string;
    author: string;
    video_link: string;
}

export interface NewsForm {
    title: string;
    type: number;
    published: boolean;
    cover: string;
    link: string;
    description: string;
    tab: string;
    author: string;
    create_time: string;
    video_link: string;
}

export interface Video {
    videoId: string;
    title: string;
    cover: string;
    published: boolean;
    create_time: string;
    video_link: string;
}

export interface VideoForm {
    title: string;
    cover: string;
    published: boolean;
    create_time: string;
    video_link: string;
}

interface ResponseData<T> {
    code: number;
    data: T;
    total?: number;
}