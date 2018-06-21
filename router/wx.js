'use strict';

const { WxCtrl } = require('../app/controller');

module.exports = (router) => {
    router.get('/api/wx', WxCtrl.share);
};