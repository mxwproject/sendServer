'use strict';

const { Logistic } = require('../models');

const LogisticCtrl = module.exports = {};

LogisticCtrl.create = async (ctx) => {
    try {
        const { departure, focus, tunnage, unitPrice, mobile, remark } = ctx.request.body;
        await Logistic.save({
            departure: departure || '',
            focus: focus || '',
            tunnage: tunnage || 0,
            unitPrice: unitPrice || 0,
            mobile: mobile || '',
            remark: remark || '',
            status: 1,
            createTime: Math.round(new Date().getTime() / 1000)
        });
        ctx.body.code = 1;
    } catch (err) {
        console.error(err);
        return ctx.body.msg = '服务器异常';
    };
}

LogisticCtrl.list = async (ctx) => {
    try {
        const options = {
            where: {},
            limit: 10,
            offset: 0,
            sort: {
                createTime: 'desc'
            }
        };
        const { status, pageSize, pageNo } = ctx.query;
        if (status) {
            options.where.status = status;
        }
        if (pageSize) {
            options.limit = pageSize;
        }
        if (pageNo) {
            options.offset = pageSize * pageNo;
        }
        const logistics = await Logistic.findAndCountAll(options);
        ctx.body.code = 1;
        ctx.body.data = {
            logistics: logistics
        }
    } catch (err) {
        console.error(err);
        return ctx.body.msg = '服务器异常';
    };
}

LogisticCtrl.detail = async (ctx) => {
    try {
        const { id } = ctx.params;
        const logistic = await Logistic.findOne({
            where: { id: id }
        });
        ctx.body.code = 1;
        ctx.body.data = logistic;
    } catch (err) {
        console.error(err);
        return ctx.body.msg = '服务器异常';
    };
}

LogisticCtrl.update = async (ctx) => {
    try {
        const { id } = ctx.params;
        const { departure, focus, tunnage, unitPrice, mobile, remark } = ctx.request.body;
        await Logistic.update({
            where: { id: id },
            set: {
                departure: departure || '',
                focus: focus || '',
                tunnage: tunnage || 0,
                unitPrice: unitPrice || 0,
                mobile: mobile || '',
                remark: remark || '',
                status: 2,
            }
        });
        ctx.body.code = 1;
    } catch (err) {
        console.error(err);
        return ctx.body.msg = '服务器异常';
    };
}