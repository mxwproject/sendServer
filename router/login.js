'use strict';

const { LoginCtrl } = require('../app/controller');

module.exports = (router) => {
    router.post('/api/login', LoginCtrl.index);
    router.post('/api/wechat/login', LoginCtrl.wechat);
};