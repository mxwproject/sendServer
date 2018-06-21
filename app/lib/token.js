'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../../config');

const Token = {};

Token.decode = async (ctx, next) => {
    try {
        const { authorization } = ctx.headers;
        if (!authorization) {
            return ctx.body.msg = '缺少token';
        }
        console.log(authorization)  // todo
        const decoded = await jwt.verify(authorization, config.token.secret);
        const user = await User.findOne({
            where: { id: decoded.id }
        });
        if (!Object.keys(user)) {
            return ctx.body.msg = '该用户不存在';
        }
        ctx.user = user;
        await next(); 
    } catch (err) {
        return ctx.body.msg = '登录失败';
    };
}

Token.getUserInfo = async (ctx, next) => {
    try {
        const { authorization } = ctx.headers;
        if (authorization) {
            const decoded = await jwt.verify(authorization, config.token.secret);
            const user = await User.findOne({
                columns: ['id', 'is_effect', 'openid'],
                where: { openid: decoded.openid }
            });
            ctx.user = user;
        }
        await next(); 
    } catch (err) {
        return ctx.body.msg = '获取用户失败';
    };
}

module.exports = Token;