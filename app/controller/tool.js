'use strict';

const qiniu = require('qiniu');
const config = require('../../config');

const ToolCtrl = module.exports = {};

ToolCtrl.qnToken = async (ctx) => {
    try {
        const { imgName } = ctx.query;
        qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
        qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;
        const putPolicy = new qiniu.rs.PutPolicy({
            scope: config.qiniu.bucket + ':' + imgName
          });
        const qnToken = putPolicy.uploadToken()
        ctx.body.code = 1;
        ctx.body.data = {
            token: qnToken,
        };
    } catch (err) {
        console.error(err);
        return ctx.body.msg = '服务器异常';
    };
}