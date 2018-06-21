'use strict';

const { Subscribe } = require('../models');

const SubscribeCtrl = {};

SubscribeCtrl.wave = async (ctx) => {
    let abscissa = [];
    let values = [];
    try {
        const data = await Subscribe.query('select date, count(date) as count from `sms_subscribe` group by date');
        for (let obj of data) {
            abscissa.push(obj.date);
            values.push(obj.count);
        }
        ctx.body.data = {
            abscissa: abscissa,
            values: values
        };
        ctx.body.code = 1;
    } catch (err) {
        console.log(err);
        return ctx.body.msg = '服务器异常';
    };
}

SubscribeCtrl.list = async (ctx) => {
    const MAX = 100;
    const options = {
        limit: 10,
        offset: 0
    };
    const { pageSize, pageNo } = ctx.query;
    if (ctx.query.pageSize) {
        options.limit = pageSize;
    }
    if (ctx.query.pageNo) {
        options.offset = pageSize * pageNo;
    }
    options.limit = options.limit > MAX ? MAX : options.limit;
    try {
        const sub = await Subscribe.findAndCountAll(options);
        const iosC = await Subscribe.count({
            where: {
                type: 1
            }
        });
        const androidC = await Subscribe.count({
            where: {
                type: 2
            }
        });
        sub.iosc = iosC[0].count;
        sub.androidC = androidC[0].count;
        ctx.body.code = 1;
        ctx.body.data = sub;
    } catch (err) {
        console.log(err);
        return ctx.body.msg = '服务器异常';
    };
}

SubscribeCtrl.count = async (ctx) => {
    try {
        const sub = await Subscribe.count({});
        sub[0].count = sub[0].count + 52361;
        ctx.body.code = 1;
        ctx.body.data = sub[0];
    } catch (err) {
        console.log(err);
        return ctx.body.msg = '服务器异常';
    };
}

module.exports = SubscribeCtrl;