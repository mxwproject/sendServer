'use strict';

const { Model } = require('dxl-mysql');
const sendDb = require('./db');

module.exports = {
    // SmsCode: new Model(gameDb, 'sms_code'),
    // Subscribe: new Model(gameDb, 'sms_subscribe'),
    // Member: new Model(gameDb, 'member'),
    // Wx: new Model(gameDb, 'wx'),    
    User: new Model(sendDb, 'send_user'),    
    Admin: new Model(sendDb, 'send_admin'),    
    Logistic: new Model(sendDb, 'send_logistic'),    
}