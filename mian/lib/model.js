const mongodb = require('./mongo');

const Model = exports = module.exports = {};

Model.News = function(data) {
    this.newsId = data.newsId;
    this.title = data.title;
    this.html = data.html;
    this.type = data.type;
    this.published = data.published;
    this.create_time = data.create_time ||  new Date().toString();
    this.last_modified_time = new Date().toString();
    this.cover = data.cover;
}

Model.Product = function(data) {
    this.productId = data.productId;
    this.title = data.title;
    this.html = data.html;
    this.type = data.type;
    this.published = data.published;
    this.create_time = data.create_time || new Date().toString();
    this.last_modified_time = new Date().toString();
    this.cover = data.cover;
}

Model.User = function(data) {
    this.username = data.username;
    this.password = data.password;
}

Model.Message = function(data) {
    this.msgId = data.msgId
    this.name = data.name;
    this.email = data.email;
    this.message = data.message;
    this.datetime = new Date().toString();
}

Model.Video = function(data) {
    this.videoId = data.videoId;
    this.title = data.title;
    this.cover = data.cover;
    this.published = data.published;
    this.youku = data.youku;
    this.youtube = data.youtube;
}