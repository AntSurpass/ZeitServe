const Validate = exports = module.exports = {};

const rules = {
    News: ['newsId', 'title', 'html', 'type', 'published', 'create_time', 'last_modified_time', 'cover'],
    Product: ['productId', 'title', 'html', 'type', 'published', 'create_time', 'last_modified_time', 'cover'],
    User: ['username', 'password'],
    Message: ['msgId', 'name', 'email', 'message', 'datetime'],
    Video: ['videoId', 'title', 'cover', 'youku', 'youtube', 'published']
};

Validate.Rule = rules;

Validate.checkParam = function(rule, data) {
    for(let i = 0; i < rule.length; i++) {
        if(data[rule[i]] == undefined) {
            return false;
        }
    }
    return true;
}