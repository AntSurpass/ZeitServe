const bcrypt = require('bcryptjs');

const Utils = exports = module.exports = {};

const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

Utils.genSessionId = function() {
    let id = '';
    for(let i = 0; i < 32; i++) {
        id += str[Math.floor(Math.random() * str.length)];
    }
    return id;
}

Utils.genRandomId = Utils.genSessionId;

Utils.encrypt = function(password) {
    return bcrypt.hashSync(password);
}

Utils.compare = function(password, hash) {
    return new Promise(resolve => {
        bcrypt.compare(password, hash, (err, result) => {
            if(err) {
                resolve(false);
                return;
            }
            resolve(result);
        });
    });
}