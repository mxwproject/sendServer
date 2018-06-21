'use strict';

const expire = '15 days';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../../config');

const LoginCtrl = module.exports = {};

LoginCtrl.index = async (ctx) => {
    try {
        const { account, password } = ctx.request.body;
        // console.log(encrypt(password))
        if (!account || !password) {
            return ctx.body.msg = '参数错误';
        }
        const user = await User.findOne({
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

const encrypt = (password) => {
    const secret = password + config.salt;
    const sha = crypto.createHash('sha256');
    sha.update(secret.toString());
    const token = sha.digest('hex');
    return token;
}