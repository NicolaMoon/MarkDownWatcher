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

// 开启服务器
http.createServer(app).listen(PORT);
console.log('The Server is Running...');

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
  let list = fs.readdirSync('./mds').map(val => path.basename(val, '.md'));
  res.render('list', { list: list });
});

app.get('/md', function (req, res) {
  let result = fs.readFileSync(`./mds/${req.query.file}.md`);
  res.render('md', { title: req.params.file, result: md.render(result.toString()), css: `css/${req.query.css}` });
});

app.get('/css/:file', function (req, res) {
  let css = fs.readFileSync(`./stylus/${req.params.file}.styl`,'utf-8');
  stylus.render(css, {filename:"normal.css"}, function(err,css){
    if(err) throw err;
    res.end(css);
  });
});
