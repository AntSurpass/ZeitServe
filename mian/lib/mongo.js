const config = require('../config');
const Logger = require('./log');
const mongoose = require('mongoose');

const mongodbUrl = `mongodb://${ config.mongodb.host }:${ config.mongodb.port }/${ config.mongodb.dbname }`;

const MongoDb = exports = module.exports = {};

const NewsType = {
    1: 'activity',
    2: 'notice',
    3: 'blog',
    'activity': 1,
    'notice': 2,
    'blog': 3
};

const ProductType = {
    1: 'core',
    2: 'unit',
    3: 'module',
    4: 'accessory',
    'core': 1,
    'unit': 2,
    'module': 3,
    'accessory': 4
};

// news表
const newsSchema = new mongoose.Schema({
    newsId: String,
    title: String,
    html: String,
    type: Number,
    published: Boolean,
    create_time: String,
    last_modified_time: String,
    cover: String
});

// product表
const productSchema = new mongoose.Schema({
    productId: String,
    title: String,
    html: String,
    type: Number,
    published: Boolean,
    create_time: String,
    last_modified_time: String,
    cover: String
});

// user表
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// 留言表
const messageSchema = new mongoose.Schema({
    msgId: String,
    name: String,
    email: String,
    message: String,
    datetime: String
});

// 视频表
const videoSchema = new mongoose.Schema({
    videoId: String,
    title: String,
    cover: String,
    youku: String,
    youtube: String,
    published: Boolean
});

MongoDb.Table = {};

MongoDb.Table.News = mongoose.model('news', newsSchema);

MongoDb.Table.Product = mongoose.model('products', productSchema);

MongoDb.Table.User = mongoose.model('users', userSchema);

MongoDb.Table.Message = mongoose.model('message', messageSchema);

MongoDb.Table.Video = mongoose.model('video', videoSchema);

MongoDb.connect = function() {
    return new Promise(resolve => {
        mongoose.connect(mongodbUrl, { useNewUrlParser: true }, (err) => {
            if(err) {
                Logger.error('Mongodb occured error when it was connecting.');
            }
            Logger.log(`Mongodb has ${ mongoose.STATES[mongoose.connection.readyState] }.`);
            resolve();
        });
    });
}

MongoDb.insertData = function(table, data) {
    return new Promise(resolve => {
        table.create([data], err => {
            if(err) {
                resolve(false);
            }
            resolve(true);
        });
    });
}

MongoDb.deleteData = function(table, condition) {
    return new Promise(resolve => {
        table.findOne(condition, (err, res) => {
            if(err) {
                resolve(false);
                return;
            }
            if(res == null) {
                resolve(false);
                return;
            }
            res.remove();
            res.save();
            resolve(true);
        });
    });
}

MongoDb.queryData = function(table, condition) {
    return new Promise(resolve => {
        table.find(condition, (err, res) => {
            if(err) {
                resolve([]);
                return;
            }
            if(res == null) {
                resolve([]);
                return;
            }
            resolve(res);
        });
    });
}

MongoDb.queryLimitData = function(table, condition, filter, offset, limit, sort) {
    return new Promise(resolve => {
        table.find(condition, filter, (err, res) => {
            if(err) {
                resolve([]);
                return;
            }
            if(res == null) {
                resolve([]);
                return;
            }
            resolve(res);
        }).skip(offset).limit(limit).sort(sort);
    });
}

MongoDb.updateData = function(table, condition, data) {
    return new Promise(resolve => {
        table.updateOne(condition, data, (err, raw) => {
            if(err) {
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
}

MongoDb.getDocumentCount = function(table) {
    return new Promise(resolve => {
        table.countDocuments((err, count) => {
            if(err) {
                resolve(0);
                return;
            }
            resolve(count);
        });
    });
}

MongoDb.getDocumentById = function(table, condition, filter) {
    return new Promise(resolve => {
        table.findOne(condition, filter, (err, res) => {
            if(err) {
                resolve(null);
                return;
            }
            resolve(res);
        });
    });
}