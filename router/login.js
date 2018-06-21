'use strict';

const { LoginCtrl } = require('../app/controller');

module.exports = (router) => {
    router.post('/api/login', LoginCtrl.index);
};