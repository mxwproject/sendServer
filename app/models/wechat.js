'use strict';

const rp = require('request-promise');
const config = require('../../config');

const Wechat = {};

Wechat.auth = async (code) => {
    const params = {
        appid: config.wx.appid,
        secret: config.wx.secret,
        grant_type: 'authorization_code',
        js_code: code
    };
    const opts = {
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        qs: params,
        json: true
    };
    const body = await rp(opts);
    return body;
};

module.exports = Wechat;