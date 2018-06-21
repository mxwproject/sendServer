'use strict';

const { SmsCtrl } = require('../app/controller');

module.exports = (router) => {
    router.get('/api/sendSms', SmsCtrl.send);
    router.get('/api/subscribe', SmsCtrl.subscribe);
};