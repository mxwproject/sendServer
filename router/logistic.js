'use strict';

const Token = require('../app/lib/token');
const { LogisticCtrl } = require('../app/controller');

module.exports = (router) => {
    router.get('/api/logistic', LogisticCtrl.list); // 物流列表
    router.get('/api/logistic/byUser', Token.decode, LogisticCtrl.detailByUser);   // 详情页
    router.get('/api/logistic/:id', LogisticCtrl.detail);   // 详情页
    router.put('/api/logistic/:id', LogisticCtrl.update);   // 修改物流接口
    router.post('/api/logistic', Token.getUserInfo, LogisticCtrl.create);  // 新增物流接口
    // router.get('/api/news', NewsCtrl.apiList);  // 获取文章列表接口
};