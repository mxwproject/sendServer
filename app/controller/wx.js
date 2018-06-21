'use strict';

const config = require('../../config');
const appId = config.wx.appId;
const nonceStr = 'vtcQMo1TXasdfasdf';
const secret = config.wx.secret;
const crypto = require('crypto');
const rp = require('request-promise'); 
const { Wx } = require('../models');

const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + secret; 

const WxCtrl = {};

WxCtrl.share = async (ctx) => {
    const jsConfig = {
	    debug: false,
	    appId: appId, // 必填，公众号的唯一标识
	    timestamp: 0, // 必填，生成签名的时间戳
	    nonceStr: nonceStr, // 必填，生成签名的随机串
	    signature: '',// 必填，签名，见附录1
	    jsApiList: [
	   		'checkJsApi',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'onMenuShareQZone'
	    ] 
    }
    let token = await Wx.findOne({
        where: {
            type: 1
        }
    });
    const nowTime = Math.round(new Date().getTime() / 1000);
    if (nowTime - token.time > 7100) {
        const newToken = await rp({
            method: 'GET',
            uri: tokenUrl
        });
        const body = JSON.parse(newToken);
        await Wx.update({
            where: {
                type: 1
            },
            set: {
                val: body.access_token,
                time: nowTime,
            }
        });
        token.val = body.access_token;
    }   
    const ticket = await Wx.findOne({
        where: {
            type: 2
        }
    });
    if (nowTime - ticket.time > 7100) {
        const ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token.val + '&type=jsapi';
        const newTicket = await rp({
            method: 'GET',
            uri: ticketUrl
        });
        const body = JSON.parse(newTicket);
        await Wx.update({
            where: {
                type: 2
            },
            set: {
                val: body.ticket,
                time: nowTime,
            }
        });
        ticket.val = body.ticket;
    }
    const timestamp = new Date().getTime();
    const qm = 'jsapi_ticket=' + ticket.val + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + ctx.query.url;
    const sha1 = crypto.createHash('sha1');
    sha1.update(qm);
    jsConfig.signature = sha1.digest('hex');
    jsConfig.timestamp = timestamp;
    jsConfig.wx_token = token.val;
    jsConfig.wx_ticket = ticket.val;
    ctx.body = jsConfig;
}

module.exports = WxCtrl;