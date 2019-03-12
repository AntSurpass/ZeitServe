# Api接口文档（客户端）

## 获取资讯列表
```
GET : http://localhost:5055/api/news
GET : https://localhost:5050/api/news
```
### 参数
| 字段名 | 备注 |
|:-----:|:----:|
| -     |-      |
### 返回值
#### 成功示例:
```
{
    "code": 1,
    "data": [
        {
            "newsId" : "D5CvtFUIja4DCCCIJaQlnpRhlWIOROKk",                          //  新闻Id
            "title" : "888sd",                                                      //  标题
            "type" : 1,                                                             //  类型 1：活动 2：通知 3：博客
            "published" : true,                                                     //  是否发布
            "create_time" : "Thu Dec 27 2018 14:57:38 GMT+0800 (GMT+08:00)",        //  发布时间
            "last_modified_time" : "Thu Dec 27 2018 14:57:38 GMT+0800 (GMT+08:00)", //  最后修改时间
            "cover" : "n-1545893855934.jpg",                                        //  封面图片
        }
        ...
    ]
}
```
失败示例:
```
{
    "code": -1,
    "data": []
}
```

---

## 通过Id获取资讯内容
```
GET : http://localhost:5055/api/news/:id
GET : https://localhost:5050/api/news/:id
```
### 参数
| 字段名 | 备注 |
|-------|:----:|
|id     |新闻Id|
### 返回值
成功:
```
{
    "code": 1,
    "data": {
        "newsId" : "D5CvtFUIja4DCCCIJaQlnpRhlWIOROKk",                          //  新闻Id
        "title" : "888sd",                                                      //  标题
        "type" : 1,                                                             //  类型 1：活动 2：通知 3：博客
        "published" : true,                                                     //  是否发布
        "create_time" : "Thu Dec 27 2018 14:57:38 GMT+0800 (GMT+08:00)",        //  发布时间
        "last_modified_time" : "Thu Dec 27 2018 14:57:38 GMT+0800 (GMT+08:00)", //  最后修改时间
        "cover" : "n-1545893855934.jpg",                                        //  封面图片
        "html" : "<p><br></p>"                                                  //  内容
    }
}
```
失败
```
{
    "code": -1,
    "data": []
}
```

---

## 获取产品列表
```
GET : http://localhost:5055/api/product
GET : https://localhost:5050/api/product
```
### 参数
| 字段名 | 备注 |
|-------|:----:|
### 返回值
成功:
```
{
    "code": 1,
    "data": [
        {
            "productId" : "4ZOkheHycVZBS1DoYoE33raA41G9cEwI",                   //  产品Id
            "title" : "Example",                                                //  标题
            "type" : 1,                                                         //  产品类型 1:主机 2:Unit 3:模块 4:配件
            "published" : true,                                                 //  是否发布
            "create_time" : "Thu Dec 27 2018 15:15:29 GMT+0800 (CST)",          //  发布时间
            "last_modified_time" : "Thu Dec 27 2018 15:15:29 GMT+0800 (CST)",   //  最后修改时间
            "cover" : "p-1545894911300.jpg"                                     //  封面图片
        }
    ]
}
```
失败
```
{
    "code": -1,
    "data": []
}
```

---

## 通过Id获取产品内容
```
GET : http://localhost:5055/api/product/:id
GET : https://localhost:5050/api/product/:id
```
### 参数
| 字段名 | 备注 |
|-------|:----:|
|id     |产品Id|
### 返回值
成功:
```
{
    "code": 1,
    "data": {
        "productId" : "4ZOkheHycVZBS1DoYoE33raA41G9cEwI",                   //  产品Id
        "title" : "Example",                                                //  标题
        "type" : 1,                                                         //  产品类型 1:主机 2:Unit 3:模块 4:配件
        "published" : true,                                                 //  是否发布
        "create_time" : "Thu Dec 27 2018 15:15:29 GMT+0800 (CST)",          //  发布时间
        "last_modified_time" : "Thu Dec 27 2018 15:15:29 GMT+0800 (CST)",   //  最后修改时间
        "cover" : "p-1545894911300.jpg",                                    //  封面图片
        "html" : "<p></br></p>"                                             //  内容
    }
}
```
失败
```
{
    "code": -1,
    "data": []
}
```

---

## 获取视频列表
```
GET : http://localhost:5055/api/video
GET : https://localhost:5050/api/video
```
### 参数
| 字段名 | 备注 |
|-------|:----:|
### 返回值
成功:
```
{
    "code": 1,
    "data": [
        {
            "videoId": "lWDWjAx4mS3NRejR2Qfs1QbMZhKI31Sf",  //  视频Id
            "title": "创意",                                 //  视频标题
            "cover": "/images/blank/no-video.png",          //   视频封面
            "published": true,                              //  是否发布
            "youku": "http://youku.com",                    //  视频优酷链接
            "youtube": "http://youtube.com"                 //  视频youtube链接
        }
    ]
}
```
失败
```
{
    "code": -1,
    "data": []
}
```

---

## 获取图片列表
```
GET : http://localhost:5055/api/image/:type/name
GET : https://localhost:5050/api/image/:type/name
```
### 参数
| 字段名 | 备注 |
|-------|:----:|
|type   |图片类型(case:案例图片,brand:商标图片)|
### 返回值
成功:
```
{
    "code": 1,
    "data": ["c-1545895265407.jpg", ...]    //  图片数组
}
```
失败
```
{
    "code": -1,
    "data": []
}
```

---

## 留言接口
```
POST : http://localhost:5055/api/message
POST : https://localhost:5050/api/message
```
### 参数
| 字段名 | 备注 |
|-------|:----:|
|name   |留言姓名|
|email  |邮箱   |
|message|留言内容|
### 返回值
成功:
```
{
    "code": 1,
    "data": []
}
```
失败
```
{
    "code": -1,
    "data": []
}
```