'use strict';

const { createPool } = require('dxl-mysql');
const { mysql } = require('../../config');
const Db = createPool(mysql);

module.exports = Db;