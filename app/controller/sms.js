'use strict';

const util = require('util');
const { SmsCode, Subscribe, Member } = require('../models');
const sms = require('../lib/sms');

const SmsCtrl = {};

SmsCtrl.send = async (ctx) => {
    const { mobile, type } = ctx.query;
    if (!isMobile(mobile)) {
        return ctx.body.msg = '手机号不正确';
    }
    const code = util.format('%d0000', Math.floor(Math.random() * 9999)).substr(0, 4);
    console.log(code)
    try {
        const options = {
            where: {
                mobile: mobile
            }
        };
        const subUser = await Subscribe.findOne(options);
        if (Object.keys(subUser).length) {
            return ctx.body.msg = '该手机号已经预约';
        }
        const user = await SmsCode.findOne(options);
        if (!Object.keys(user).length) {
            await SmsCode.save({
                mobile: mobile,
                code: code,
                time: Math.round(new Date().getTime() / 1000)
            });
        } else {
            const time = Math.round(new Date().getTime() / 1000) - user.time;
            if (time < 60) {
                return ctx.body.msg = '验证码已经发送,一分钟之后再试';
            }
            // 已存在
            await SmsCode.update({
                where: {
                    mobile: mobile
                },
                set: {
                    code: code,
                    time: Math.round(new Date().getTime() / 1000)
                }
            })
        }
        await sms.send(mobile, 'SMS_133001437', `{code: '${code}'}`);
        ctx.body.code = 1;
        ctx.body.msg = '发送成功';
    } catch (err) {
        console.log(err);
        ctx.body.msg = '服务器异常';
    };
}

SmsCtrl.subscribe = async (ctx) => {
    const { mobile, code, type } = ctx.query;
    if (!isMobile(mobile)) {
        return ctx.body.msg = '手机号不正确';
    }
    if (type != 1 && type != 2) {
        return ctx.body.msg = '类型有误';
    }
    try {
        const options = {
            where: {
                mobile: mobile
            }
        };
        const subUser = await Subscribe.findOne(options);
        if (Object.keys(subUser).length) {
            return ctx.body.msg = '该手机号已经预约';
        }
        const user = await SmsCode.findOne(options);
        if (!Object.keys(user).length) {
            return ctx.body.msg = '请先获取验证码';
        } 
        const time = Math.round(new Date().getTime() / 1000) - user.time;
        if (time > 60) {
            return ctx.body.msg = '超过有效时间';
        }
        if (code != user.code) {
            return ctx.body.msg = '验证码无效';
        }
        const sub = await Subscribe.save({
            mobile: mobile,
            type: type,
            time: Math.round(new Date().getTime() / 1000),
            date: getDate()
        });
        const member = await Member.findOne({
            where: {
                id: sub.insertId
            }
        })
        await sms.send(mobile, 'SMS_134314740', `{code: '${member.num}'}`);
        ctx.body.code = 1;
        ctx.body.data = member;
        ctx.body.msg = '预约成功';
    } catch (err) {
        console.log(err);
        ctx.body.msg = '服务器异常';
    };
}

module.exports = SmsCtrl;

const isMobile = (mobile) => {
    let reg = /^1[1-9]\d{9}$/;
    return mobile ? !!(mobile.toString().match(reg)) : false;
};

const getDate = () => {
    const myDate = new Date();
    const year = myDate.getFullYear(); 
    const month = myDate.getMonth() + 1; 
    const day = myDate.getDate(); 
    function Appendzero(obj) {
        if(obj < 10) return '0' + obj;  
        else return obj; 
    }
    return `${year}-${Appendzero(month)}-${Appendzero(day)}`;
}