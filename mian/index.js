require('./m5stack-com/node_modules/zone.js/dist/zone-node');
require('./m5stack-com/node_modules/reflect-metadata');

const AngularPlatFormServer = require('./m5stack-com/node_modules/@angular/platform-server');
const AngularCore = require('./m5stack-com/node_modules/@angular/core');

const express = require('express');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const mongodb = require('./lib/mongo');
const Logger = require('./lib/log');
const Validate = require('./lib/validate');
const model = require('./lib/model');
const utils = require('./lib/utils');
const config = require('./config');

AngularCore.enableProdMode();

const app = express();

const DOMAIN = config.domain;
const HTTPS_PORT = process.env.PORT || 5050;
const HTTP_PORT = 5055;
const DIST_FOLDER = path.join(__dirname, 'm5stack-com', 'dist');

const httpsOption = {
    key: fs.readFileSync(path.join(__dirname, 'certificate', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certificate', 'server.cert'))
};

const template = fs.readFileSync(path.join(DIST_FOLDER, 'm5stack-com', 'index.html')).toString();

const AngularSsr = require('./m5stack-com/dist/m5stack-com-ssr/main');

const NgFactoryLoader = require('./m5stack-com/node_modules/@nguniversal/module-map-ngfactory-loader');

let adminSessions = [];
const MAX_ADMIN_COUNT = 5;
const IMG_NAME = {
    productBanner: 'banner-product',
    newsBanner: 'banner-news',
    contact: 'banner-contact',
    stem: 'banner-stem',
    uiflow: 'banner-uiflow',
    linkUiflow: 'link-uiflow',
    linkStem: 'link-stem',
    case: 'case-list',
    brand: 'brand-list',
    product: 'product-cover',
    news: 'news-cover',
    video: 'video-cover'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let pathname = req.params.image;
        switch(pathname) {
            case IMG_NAME.productBanner:
            case IMG_NAME.newsBanner:
            case IMG_NAME.contact:
            case IMG_NAME.stem:
            case IMG_NAME.uiflow:
            case IMG_NAME.link_uiflow:
            case IMG_NAME.link_stem:
                cb(null, path.join(__dirname, './images'));
                break;
            case IMG_NAME.product:
                cb(null, path.join(__dirname, './images/product'));
                break;
            case IMG_NAME.news:
                cb(null, path.join(__dirname, './images/news'));
                break;
            case IMG_NAME.case:
                cb(null, path.join(__dirname, './images/case'));
                break;
            case IMG_NAME.brand:
                cb(null, path.join(__dirname, './images/brand'));
                break;
            case IMG_NAME.video:
                cb(null, path.join(__dirname, './images/video'));
                break;
            default:
                cb(null, path.join(__dirname, './images'));
                break;
        }
    },
    filename: function (req, file, cb) {
        let pathname = req.params.image;
        let ext = file.originalname.split('.')[1];
        let filename = '';
        switch(pathname) {
            case IMG_NAME.productBanner:
            case IMG_NAME.newsBanner:
            case IMG_NAME.contact:
            case IMG_NAME.stem:
            case IMG_NAME.uiflow:
            case IMG_NAME.link_uiflow:
            case IMG_NAME.link_stem:
                cb(null, `${ pathname }.jpg`);
                break;
            case IMG_NAME.product:
                filename = `p-${ Date.now() }.${ ext }`;
                req.saveAsFilename = filename;
                cb(null, filename);
                break;
            case IMG_NAME.news:
                filename = `n-${ Date.now() }.${ ext }`;
                req.saveAsFilename = filename;
                cb(null, filename);
                break;
            case IMG_NAME.case:
                filename = `c-${ Date.now() }.${ ext }`;
                req.saveAsFilename = filename;
                cb(null, filename);
                break;
            case IMG_NAME.brand:
                filename = `b-${ Date.now() }.${ ext }`;
                req.saveAsFilename = filename;
                cb(null, filename);
                break;
            case IMG_NAME.video:
                filename = `v-${ Date.now() }.${ ext }`;
                req.saveAsFilename = filename;
                cb(null, filename);
                break;
            default:
                break;
        }
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        let pathname = req.params.image;
        switch(pathname) {
            case IMG_NAME.productBanner:
            case IMG_NAME.newsBanner:
            case IMG_NAME.contact:
            case IMG_NAME.stem:
            case IMG_NAME.uiflow:
            case IMG_NAME.link_uiflow:
            case IMG_NAME.link_stem:
            case IMG_NAME.case:
            case IMG_NAME.brand:
            case IMG_NAME.product:
            case IMG_NAME.news:
            case IMG_NAME.video:
                req.allowUpload = true;
                cb(null, true);
                break;
            default:
                req.allowUpload = false;
                cb(null, false);
                break;
        }
    }
});

const update = multer({
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            let filename = req.params.name;
            cb(null, filename);
        },
        destination: (req, file, cb) => {
            let pathname = req.params.imageType;
            switch(pathname) {
                case IMG_NAME.product:
                    cb(null, path.join(__dirname, './images/product'));
                    break;
                case IMG_NAME.news:
                    cb(null, path.join(__dirname, './images/news'));
                    break;
                case IMG_NAME.case:
                    cb(null, path.join(__dirname, './images/case'));
                    break;
                case IMG_NAME.brand:
                    cb(null, path.join(__dirname, './images/brand'));
                    break;
                case IMG_NAME.video:
                    cb(null, path.join(__dirname, './images/video'));
                    break;
                default:
                    break;
            }
        }
    }),
    fileFilter: (req, file, cb) => {
        let pathname = req.params.imageType;
        switch(pathname) {
            case IMG_NAME.case:
            case IMG_NAME.brand:
            case IMG_NAME.product:
            case IMG_NAME.news:
            case IMG_NAME.video:
                req.allowUpload = true;
                cb(null, true);
                break;
            default:
                req.allowUpload = false;
                cb(null, false);
                break;
        }
    }
});

app.use(cookieSession({
    name: 'm5stack-session',
    keys: ['m5isgood'],
    maxAge: 24 * 60 * 60 * 1000
}));

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.engine('html', (_, options, callback) => {
    AngularPlatFormServer.renderModuleFactory(AngularSsr.AppServerModuleNgFactory, {
        document: template,
        url: options.req.url,
        extraProviders: [
            NgFactoryLoader.provideModuleMap(AngularSsr.LAZY_MODULE_MAP)
        ]
    }).then(html => {
        callback(null, html);
    })
});

app.set('view engine', 'html');
app.set('views', path.join(DIST_FOLDER, 'm5stack-com'));

// 跨域设置（调试使用）
// app.all('*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Access-Control-Allow-Methods', '*');
//     res.header('Content-Type', 'application/json;charset=utf-8');
//     next();
// });

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', config.domain);
    next();
});

// http转https
// app.all('*', (req, res, next) => {
//     if(req.protocol === 'http') {
//         res.redirect(`https://${ DOMAIN }:${ HTTPS_PORT }`);
//         return;
//     }
//     next();
// });

// 权限判断
app.use((req, res, next) => {
    if(req.path.indexOf('assets') >= 0) {
        next();
        return;
    }
    if(/^\/images\//g.test(req.path)) {
        next();
        return;
    }
    if(req.path.indexOf('admin') === -1 || req.path === '/api/admin/login'|| req.path === '/admin/login') {
        next();
        return;
    }
    if(adminSessions.indexOf(req.session.id) > -1) {
        next();
        return;
    }
    // res.send({code: -1, data: []});
    // res.redirect(301, `https://${ DOMAIN }:${ HTTPS_PORT }/admin/login`);
    res.redirect(301, `http://${ DOMAIN }/admin/login`);
});

// 静态网站
app.get('*', express.static(path.join(__dirname)));
app.get('*', express.static(path.join(DIST_FOLDER, 'm5stack-com')));
app.get('*', express.static(path.join(DIST_FOLDER, 'm5stack-com', 'dist', '')));

// 登录
app.post('/api/admin/login', async(req, res, next) => {
    if(!Validate.checkParam(Validate.Rule.User, req.body)) {
        res.send({code: -1, data: []});
        return;
    }
    let userInfo = new model.User(req.body);
    let doc = await mongodb.queryData(mongodb.Table.User, { username: userInfo.username });
    if(doc.length === 0 || userInfo.password !== doc[0].password) {
        res.send({code: -1, data: []});
        return;
    }
    
    let sessionId = utils.genSessionId();
    req.session.id = sessionId;
    if(adminSessions.length === 5) {
        adminSessions.shift();
    }
    adminSessions.push(sessionId);
    
    res.send({code: 1, data: []});
});

// 获取新闻列表
app.get('/api/admin/news', async (req, res, next) => {
    let total = await mongodb.getDocumentCount(mongodb.Table.News);
    let docs = await mongodb.queryLimitData(mongodb.Table.News, {}, { html: 0, __v: 0, _id: 0 }, parseInt(req.query.offset), 10, { "create_time": -1 });
    res.send({code: 1, data: docs, total: total});
});

// 通过ID获取新闻
app.get('/api/admin/news/:id', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id) {
        res.send({code: -1, data: []});
        return;
    }
    let news = await mongodb.getDocumentById(mongodb.Table.News, { newsId: data.id }, { __v: 0, _id: 0 });
    if(news == null) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: news});
});

// 添加一个新闻
app.post('/api/admin/news/:title', async (req, res, next) => {
    let data = Object.assign({}, req.body, {
        newsId: utils.genRandomId()
    });
    let news = new model.News(data);
    if(!Validate.checkParam(Validate.Rule.News, news)) {
        res.send({code: -1, data: []});
        return;
    }
    let flag = await mongodb.insertData(mongodb.Table.News, news);
    if(!flag) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: []});
});

// 修改一个新闻
app.put('/api/admin/news/:id', async (req, res, next) => {
    let data = Object.assign({}, req.body, {
        newsId: req.params.id
    });
    let news = new model.News(data);
    if(!Validate.checkParam(Validate.Rule.News, news)) {
        res.send({code: -1, data: []});
        return;
    }
    let flag = await mongodb.updateData(mongodb.Table.News, { newsId: req.params.id }, news);
    if(!flag) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: []});
});

// 通过ID修改新闻发布状态
app.put('/api/admin/news/:id/published/:status', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id || ( data.status != 0 && data.status != 1 )) {
        res.send({code: -1, data: []});
        return;
    }
    let flag = await mongodb.updateData(mongodb.Table.News, { newsId: data.id }, { published: data.status });
    if(!flag) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: []});
});

// 删除新闻
app.delete('/api/admin/news/:id', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id) {
        res.send({ code: -1, data: [] });
        return;
    }
    let flag = await mongodb.deleteData(mongodb.Table.News, { newsId: data.id });
    if(!flag) {
        res.send({ code: -1, data: [] });
        return;
    }
    res.send({ code: 1, data: [] });
});

// 获取产品列表
app.get('/api/admin/product', async (req, res, next) => {
    let total = await mongodb.getDocumentCount(mongodb.Table.Product);
    let docs = await mongodb.queryLimitData(mongodb.Table.Product, {}, { html: 0, __v: 0, _id: 0 }, parseInt(req.query.offset), 10, { "create_time": -1 });
    res.send({code: 1, data: docs, total: total});
});

// 通过ID获取产品信息
app.get('/api/admin/product/:id', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id) {
        res.send({code: -1, data: []});
        return;
    }
    let product = await mongodb.getDocumentById(mongodb.Table.Product, { productId: data.id }, { __v: 0, _id: 0 });
    if(product == null) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: product});
});

// 添加一个产品信息
app.post('/api/admin/product/:title', async (req, res, next) => {
    let data = Object.assign({}, req.body, {
        productId: utils.genRandomId()
    });
    let product = new model.Product(data);
    if(!Validate.checkParam(Validate.Rule.Product, product)) {
        res.send({code: -1, data: []});
        return;
    }
    let flag = await mongodb.insertData(mongodb.Table.Product, product);
    if(!flag) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: []});
});

// 修改一个产品信息
app.put('/api/admin/product/:id', async (req, res, next) => {
    let data = Object.assign({}, req.body, {
        productId: req.params.id
    });
    let product = new model.Product(data);
    if(!Validate.checkParam(Validate.Rule.Product, product)) {
        res.send({code: -1, data: []});
        return;
    }
    let flag = await mongodb.updateData(mongodb.Table.Product, { newsId: req.params.id }, product);
    if(!flag) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: []});
});

// 通过ID修改产品发布状态
app.put('/api/admin/product/:id/published/:status', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id || ( data.status != 0 && data.status != 1 )) {
        res.send({code: -1, data: []});
        return;
    }
    let flag = await mongodb.updateData(mongodb.Table.Product, { productId: data.id }, { published: data.status });
    if(!flag) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: []});
});

// 删除产品信息
app.delete('/api/admin/product/:id', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id) {
        res.send({ code: -1, data: [] });
        return;
    }
    let flag = await mongodb.deleteData(mongodb.Table.Product, { productId: data.id });
    if(!flag) {
        res.send({ code: -1, data: [] });
        return;
    }
    res.send({ code: 1, data: [] });
});

// 获取留言列表
app.get('/api/admin/message', async (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0;
    let allDocs = await mongodb.queryData(mongodb.Table.Message, {});
    let docs = await mongodb.queryLimitData(mongodb.Table.Message, {}, { _id: 0, __v: 0 }, offset, 30, { "create_time": -1 });
    res.send({ code: 1, data: docs, total: allDocs.length });
});

// 上传图片
app.post('/api/admin/upload/image/:image', upload.single('img'), (req, res, next) => {
    if(!req.allowUpload) {
        res.send({ code: -1, data: [] });
        return;
    }
    if(!req.saveAsFilename) {
        res.send({ code: 1, data: '' });
        return;
    }
    res.send({ code: 1, data: req.saveAsFilename });
});

// 更改图片
app.post('/api/admin/update/image/:imageType/:name', update.single('img'), (req, res, next) => {
    if(!req.allowUpload) {
        res.send({ code: -1, data: [] });
        return;
    }
    res.send({ code: 1, data: [] });
});

// 删除图片
app.delete('/api/admin/update/image/:imageType/:name', (req, res, next) => {
    let imageType = req.params.imageType;
    let name = req.params.name;
    switch(imageType) {
        case IMG_NAME.case:
            fs.unlink(path.join('images', 'case', name), err => {
                if(err) {
                    res.send({ code: -1, data: [] });
                    return;        
                }
                res.send({ code: 1, data: [] });
            });
            break;
        case IMG_NAME.brand:
            fs.unlink(path.join('images', 'brand', name), err => {
                if(err) {
                    res.send({ code: -1, data: [] });
                    return;        
                }
                res.send({ code: 1, data: [] });
            });
            break;
        default:
            res.send({ code: -1, data: [] });
    }
});

// 获取图片
app.get('/api/admin/image/:type/name', (req, res, next) => {
    let type = req.params.type;
    fs.readdir(path.join('images', type), (err, files) => {
        if(err) {
            res.send({ code: -1, data: [] });
            return;
        }
        res.send({ code: 1, data: files });
    });
});

// 获取视频列表
app.get('/api/admin/video', async (req, res, next) => {
    let docs = await mongodb.queryLimitData(mongodb.Table.Video, {}, { _id: 0, __v: 0 }, 0, 0, { "_id": -1 });
    res.send({ code: 1, data: docs, total: docs.length });
});

// 添加视频信息
app.post('/api/admin/video', async (req, res, next) => {
    let payload = Object.assign({}, req.body, {
        videoId: utils.genRandomId()
    });
    let video = new model.Video(payload);
    if(!Validate.checkParam(Validate.Rule.Video, video)) {
        res.send({ code: -1, data: [] });
        return;
    }
    let flag = await mongodb.insertData(mongodb.Table.Video, video);
    if(!flag) {
        res.send({ code: -1, data: [] });
        return;
    }
    res.send({ code: 1, data: [] });
});

// 通过Id获取视频信息
app.get('/api/admin/video/:id', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id) {
        res.send({code: -1, data: []});
        return;
    }
    let video = await mongodb.getDocumentById(mongodb.Table.Video, { videoId: data.id }, { __v: 0, _id: 0 });
    if(video == null) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: video});
});

// 更新视频信息
app.put('/api/admin/video/:id', async (req, res, next) => {
    let id = req.params.id;
    let payload = Object.assign({}, req.body, {
        videoId: id
    });
    let video = new model.Video(payload);
    if(!Validate.checkParam(Validate.Rule.Video, video)) {
        res.send({ code: -1, data: [] });
        return;
    }
    let flag = await mongodb.updateData(mongodb.Table.Video, { videoId: req.params.id }, video);
    if(!flag) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({ code: 1, data: [] });
});

// 修改视频发布状态
app.put('/api/admin/video/:id/published/:status', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id || ( data.status != 0 && data.status != 1 )) {
        res.send({code: -1, data: []});
        return;
    }
    let flag = await mongodb.updateData(mongodb.Table.Video, { videoId: data.id }, { published: data.status });
    if(!flag) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: []});
});

//  删除视频信息
app.delete('/api/admin/video/:id', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id) {
        res.send({ code: -1, data: [] });
        return;
    }
    let flag = await mongodb.deleteData(mongodb.Table.Video, { videoId: data.id });
    if(!flag) {
        res.send({ code: -1, data: [] });
        return;
    }
    res.send({ code: 1, data: [] });
});

/** 客户端 */

// 获取新闻列表
app.get('/api/news', async (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0;
    let allDocs = await mongodb.queryData(mongodb.Table.News, { published: true });
    let docs = await mongodb.queryLimitData(mongodb.Table.News, { published: true }, { html: 0, _id: 0, __v: 0 }, 0, 0, { "create_time": -1 });
    res.send({ code: 1, data: docs, total: allDocs.length });
});

// 通过ID获取新闻
app.get('/api/news/:id', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id) {
        res.send({code: -1, data: []});
        return;
    }
    let news = await mongodb.getDocumentById(mongodb.Table.News, { newsId: data.id }, { __v: 0, _id: 0 });
    if(news == null) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: news});
});

// 获取产品列表
app.get('/api/product', async (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0;
    let allDocs = await mongodb.queryData(mongodb.Table.Product, { published: true });
    let docs = await mongodb.queryLimitData(mongodb.Table.Product, { published: true }, { html: 0, _id: 0, __v: 0 }, 0, 0, { "create_time": -1 });
    res.send({ code: 1, data: docs, total: allDocs.length });
});

// 通过ID获取产品
app.get('/api/product/:id', async (req, res, next) => {
    let data = Object.assign({}, req.params);
    if(!data.id) {
        res.send({code: -1, data: []});
        return;
    }
    let product = await mongodb.getDocumentById(mongodb.Table.Product, { productId: data.id }, { __v: 0, _id: 0 });
    if(product == null) {
        res.send({code: -1, data: []});
        return;
    }
    res.send({code: 1, data: product});
});

// 获取视频列表
app.get('/api/video', async (req, res, next) => {
    let offset = parseInt(req.query.offset) || 0;
    let allDocs = await mongodb.queryData(mongodb.Table.Video, { published: true });
    let docs = await mongodb.queryLimitData(mongodb.Table.Video, { published: true }, { html: 0, _id: 0, __v: 0 }, 0, 0, { "_id": -1 });
    res.send({ code: 1, data: docs, total: allDocs.length });
});

// 获取图片
app.get('/api/image/:type/name', (req, res, next) => {
    let type = req.params.type;
    fs.readdir(path.join('images', type), (err, files) => {
        if(err) {
            res.send({ code: -1, data: [] });
            return;
        }
        res.send({ code: 1, data: files });
    });
});

// 游客留言
app.post('/api/message', async (req, res, next) => {
    let data = Object.assign({}, req.body, {
        msgId: utils.genRandomId()
    });
    let msg = new model.Message(data);
    if(!Validate.checkParam(Validate.Rule.Message, msg)) {
        res.send({ code: -1, data: [] });
        return;
    }
    let flag = await mongodb.insertData(mongodb.Table.Message, msg);
    if(!flag) {
        res.send({ code: -1, data: [] });
        return;
    }
    res.send({ code: 1, data: [] });
});

app.get('*', (req, res, next) => {
    res.render(path.join(DIST_FOLDER, 'm5stack-com', 'index.html'), { req });
});

const appStart = async () => {
    await mongodb.connect();
    // await https.createServer(httpsOption, app).listen(HTTPS_PORT, () => {
    //     Logger.log(`Webserver listening on https://${ DOMAIN }:${ HTTPS_PORT }`);
    // });
    await http.createServer(app).listen(HTTP_PORT, () => {
        Logger.log(`Webserver listening on http://${ DOMAIN }:${ HTTP_PORT }, will redirect to https://${ DOMAIN }:${ HTTPS_PORT }`);
    });
}

appStart();