'use strict';

const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const cors = require('koa2-cors');
const views = require('koa-views');
const morgan = require('koa-morgan');
const _static = require('koa-static');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');

const backInit = require('./app/lib/backInit');
const adapter = require('./app/lib/adapter');
const turnInterface = require('./app/lib/turnInterface');

const app = new Koa();

// 跨域
app.use(cors());

// 解析body
app.use(bodyParser())

// 静态文件
app.use(_static(
    path.join( __dirname,  './static')
));

// log
app.use(morgan('dev'));

// gzip
const options = { threshold: 2048 };
app.use(compress(options));

// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
    extension: 'ejs'
}));

// 初始化返回值
app.use(backInit);

// 适配移动端
app.use(adapter);

// 转接口
app.use(turnInterface);

const router = require('./router');
app.use(router.routes());

app.listen(3000, () => {
  console.log('starting at port 3000');
});