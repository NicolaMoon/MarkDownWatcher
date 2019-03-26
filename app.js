const express = require("express");
const http = require("http");
const app = express();
const fs = require('fs');
const md = require('markdown-it')();

// 设置渲染模版
app.set('views', './views');
app.set('view engine', 'pug');

// 引入stylus
const stylus = require('stylus');

// api路由请求
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

http.createServer(app).listen(3000);
console.log('The Server is Running...');
