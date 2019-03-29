const express = require("express");
const http = require("http");
const app = express();
const fs = require('fs');
const path = require('path');
// 引用markdown动态解析模块
const md = require('markdown-it')();
// 可以使用exec 来执行系统的默认命令；child_process为内置模块 
const {exec} = require("child_process");
// 引入stylus
const stylus = require('stylus');

// 全局变量
const HOST = 'http://127.0.0.1:';
const PORT = 3000;

// 设置渲染模版
app.set('views', './views');
app.set('view engine', 'pug');

// 静态资源处理中间件，不用再自己手动构造处理方法了
app.use(express.static('./public'));

// 开启服务器
http.createServer(app).listen(PORT);
console.log('The Server is Running...');

// 自动打开浏览器
switch (process.platform) {
  //mac系统使用 一下命令打开url在浏览器
  case "darwin":
      exec(`open ${HOST+PORT}`);
      break;
  //win系统使用 一下命令打开url在浏览器
  case "win32":
      exec(`start ${HOST+PORT}`);
      break;
      // 默认mac系统
  default:
      exec(`open ${HOST+PORT}`);
}

// api路由请求
app.get('/', function (req, res) {
  let mdList = fs.readdirSync('./mds').map(val => path.basename(val, '.md'));
  let cssList = fs.readdirSync('./stylus').map(val => path.basename(val, '.styl'));
  let mdFile = fs.readFileSync(`./mds/${req.query.file || 'index'}.md`);
  res.render('list', { mdList: mdList, cssList: cssList, css: req.query.css || 'normal', mdFile: md.render(mdFile.toString()), fileName: req.query.file || 'index' });
});

app.get('/css/:file', function (req, res) {
  let css = fs.readFileSync(`./stylus/${req.params.file || 'index'}.styl`,'utf-8');
  stylus.render(css, {filename:"normal.css"}, function(err,css){
    if(err) throw err;
    res.end(css);
  });
});
