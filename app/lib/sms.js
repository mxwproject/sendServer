'use strict';

const SmsClient = require('@alicloud/sms-sdk');
const { accessKeyId, secretAccessKey } = require('../../config');
const smsClient = new SmsClient({
    accessKeyId, 
    secretAccessKey
});

module.exports = {
    'send': (mobile,temp,param) => {
        return new Promise((resolve, reject) => {
            smsClient.sendSMS({
                PhoneNumbers: mobile,
                SignName: '火王破晓之战',
                TemplateCode: temp,
                TemplateParam: param
            }).then(function (res) {
                const { Code } = res
                if (Code === 'OK') {
                    return resolve(res)
                }else{
                    return reject(res)
                }
            }, function (err) {
                console.error(err)
                return reject(err)
            })
        });
    }
}
