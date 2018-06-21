'use strict';

const Token = require('../app/lib/token');
const { ToolCtrl } = require('../app/controller');

module.exports = (router) => {
    router.get('/api/tool/qiniu', Token.decode, ToolCtrl.qnToken);
};