'use strict';

const Token = require('../app/lib/token');
const { SubscribeCtrl } = require('../app/controller');

module.exports = (router) => {
    router.get('/admin/subscribe', Token.decode, SubscribeCtrl.wave);
    router.get('/admin/subscribe/list', Token.decode, SubscribeCtrl.list);
    router.get('/api/subscribe/count', Token.decode, SubscribeCtrl.count);
};