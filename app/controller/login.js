'use strict';

const expire = '15 days';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');
const config = require('../../config');

const LoginCtrl = module.exports = {};

LoginCtrl.index = async (ctx) => {
    try {
        const { account, password } = ctx.request.body;
        // console.log(encrypt(password))
        if (!account || !password) {
            return ctx.body.msg = '参数错误';
        }
        const user = await Admin.findOne({
            where: { account: account }
        });
        if (!Object.keys(user).length) {
            return ctx.body.msg = '账号或密码错误';
        }
        if (user.password !== encrypt(password)) {
            return ctx.body.msg = '账号或密码错误';
        }
        const { id, name } = user;
        const token = jwt.sign({
            id: id,
            name: name
        }, config.token.secret, { expiresIn: expire });
        ctx.body.code = 1;
        ctx.body.data = {
            token: token,
            expire: new Date().getTime() + 14 * 24 * 60 * 60 * 1000
        };
    } catch (err) {
        console.error(err);
        return ctx.body.msg = '服务器异常';
    };
}

LoginCtrl.wechat = async (ctx) => {
    try {
        const { code } = ctx.request.body;
        if (!code) {
            return ctx.body.msg = '缺少参数';
        }
        const body = await Wechat.auth(code);
        // const body = { 
        //     session_key: 'xcZYJrqweM8t9jqPplkXHg==',
        //     openid: 'owp1J5GeSqhNUjyP4ce0svGtLm-g' 
        // };
        if (body.errcode) {
            return ctx.body.msg = '无效的code';
        }
        const { openid } = body;
        const user = await User.findOne({
            where: { openid: openid }
        });
        if (!Object.keys(user).length) {
            await User.save({
                openid: openid,
                createTime: Math.round(new Date().getTime() / 1000)
            });
        }
        const token = jwt.sign(body, config.token.secret, { expiresIn: expire });
        ctx.body.code = 1;
        ctx.body.data = {
            token: token
        };
    } catch (err) {
        console.error(err);
    };
}

const encrypt = (password) => {
    const secret = password + config.salt;
    const sha = crypto.createHash('sha256');
    sha.update(secret.toString());
    const token = sha.digest('hex');
    return token;
}