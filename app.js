const express = require("express");
const http = require("http");
const app = express();
var bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
// 引用markdown动态解析模块
const md = require('markdown-it')();
// 可以使用exec 来执行系统的默认命令；child_process为内置模块 
const {exec} = require("child_process");
// 引入stylus
const stylus = require('stylus');
// 引入moment时间格式化
const moment = require('moment');

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

app.use(bodyParser.json());

// api路由请求
// 首页面
app.get('/', function (req, res) {
  let mdList = fs.readdirSync('./mds').filter(val => path.extname(val) === '.md').map(val => path.basename(val, '.md'));
  let cssList = fs.readdirSync('./stylus').map(val => path.basename(val, '.styl'));
  let mdFile = fs.readFileSync(`./mds/${req.query.file || 'index'}.md`);
  let fileInfo = null;
  let stats = fs.statSync(`./mds/${req.query.file || 'index'}.md`);
  let data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))[req.query.file || 'index'];
  let comments = data ? data.comments : [];
  const { mtime, birthtime } = stats;
  fileInfo={ mtime: moment(mtime).format('YYYY-MM-DD HH:mm:ss'), birthtime: moment(birthtime).format('YYYY-MM-DD HH:mm:ss') };
  res.render('home', {
    mdList,
    cssList: cssList, css: req.query.css || 'normal',
    mdFile: md.render(mdFile.toString()),
    fileName: req.query.file || 'index',
    fileInfo,
    comments,
  });
});

// css获取
app.get('/css/:file', function (req, res) {
  let css = fs.readFileSync(`./stylus/${req.params.file || 'index'}.styl`,'utf-8');
  stylus.render(css, {filename:"normal.css"}, function(err,css){
    if(err) throw err;
    res.end(css);
  });
});

// 提交评论
app.get('/comment.submit', function (req, res) {
  let data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  if (!data[req.query.file]) data[req.query.file] = { comments: [] };
  data[req.query.file].comments.push(req.query);
  fs.writeFileSync('./data.json', JSON.stringify(data));
  res.json({success: true});
});

// 删除评论
app.get('/comment.delete', function (req, res) {
  let data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  data[req.query.file].comments.splice(req.query.index, 1);
  fs.writeFileSync('./data.json', JSON.stringify(data));
  res.json({success: true});
});

// 回复评论
app.get('/comment.reply', function (req, res) {
  let data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  if (!data[req.query.file].comments[req.query.index].replies) data[req.query.file].comments[req.query.index].replies = [];
  data[req.query.file].comments[req.query.index].replies.push({
    author: req.query.author,
    time: req.query.time,
    reply: req.query.reply
  });
  fs.writeFileSync('./data.json', JSON.stringify(data));
  res.json({success: true});
});

// 编辑页面
app.get('/edit', function (req, res) {
  let cssList = fs.readdirSync('./stylus').map(val => path.basename(val, '.styl'));
  let mdFile = fs.readFileSync(`./mds/${req.query.file}.md`);
  res.render('edit', {
    cssList: cssList,
    css: req.query.css || 'normal',
    md: mdFile,
    html: md.render(mdFile.toString()),
    fileName: req.query.file,
  });
});

// 编辑操作
app.post('/md.edit', function (req, res) {
  fs.writeFileSync(`./mds/${req.body.file}.md`, req.body.text);
  let mdFile = fs.readFileSync(`./mds/${req.body.file}.md`);
  res.json({ success: true, text: md.render(mdFile.toString()) });
});

// 修改文件名
app.post('/name.edit', function (req, res) {
  fs.rename(`./mds/${req.body.file}.md`, `./mds/${req.body.name}.md`, (err) => {
    if (err) res.json({ success: fasle });
    else res.json({ success: true });
  });
});

// 创建文件
app.get('/file.new', function (req, res) {
  fs.writeFile(`./mds/${req.query.name}.md`, '', (err) => {
    if (err) res.json({ success: false });
    else res.json({ success: true });
  });
});

// 删除文件
app.get('/file.delete', function (req, res) {
  fs.unlink(`./mds/${req.query.name}.md`, (err) => {
    if (err) res.json({ success: false });
    else res.json({ success: true });
  });
});