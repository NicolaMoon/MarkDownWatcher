// 作为被评论文本的全局存储
let commentForText = undefined;
// 判断单击还是长按的变量
let clickStart = undefined;
let clickEnd = undefined;
// 获取URL的querys
function getQuerys() {
  let url = window.location.href;
  let querys = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    querys[key] = value;
  });
  return querys;
}
let querys = getQuerys();
// fetch封装
function getFetch(url, params) {
  url += Object.entries(params).reduce((before, current) => `${before}&${current[0]}=${current[1]}`, '?');
  console.log(url);
  return fetch(url, { method: 'GET' }).then(res => res.json());
}

// 改变样式文件
function handleChangeStyle() {
  let select = document.getElementById('selectCss');
  let cssValue = select.value;
  window.location.href = `../?file=${querys.file || 'index'}&css=${cssValue}`;
}
// 监听按下鼠标按钮事件
document.addEventListener("mousedown", mouseDown, true);
function mouseDown() {
  clickStart = new Date().getTime();
}
// 监听释放鼠标按钮事件
document.addEventListener("mouseup", mouseUp, true);
function mouseUp() {
  const tooltip = document.getElementsByClassName('tooltip')[0];
  clickEnd = new Date().getTime();
  if (clickEnd - clickStart < 150) {
    tooltip.style.cssText = 'display: none;';
    return;
  }
  var text = "";
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }
  if ("" !== text) {
    const textPosition = window.getSelection().getRangeAt(0).getBoundingClientRect();
    if (textPosition.x < 160 || textPosition.x > 860 || textPosition.y < 60) return;
    tooltip.style.cssText = `top: ${textPosition.y - 120}; left: ${textPosition.x + textPosition.width/2 - 205}; display: block;`;
    commentForText = text;
  }
}
// 评论框展示
function handleShowComment() {
  const comment = document.getElementById('commenting');
  const title = comment.getElementsByClassName('comment-title')[0];
  const tooltip = document.getElementsByClassName('tooltip')[0];
  comment.style.cssText = 'display: block';
  tooltip.style.cssText = 'display: none;';
  title.innerHTML = commentForText;
}
// 提交评论
function handleSubmitComment() {
  const commentWord = document.getElementsByTagName('textarea')[0].value;
  const currentTime = new Date();
  const time = `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()} ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
  const type = document.getElementById('selectType').value;
  getFetch('/comment.submit', {
    file: querys.file || 'index',
    author: 'Nicola',
    time,
    text: commentForText,
    type,
    comment: commentWord
  }).then(res => res.success ? window.location.reload() : null);
}
// 取消评论
function handleCancleComment() {
  const comment = document.getElementById('commenting');
  const tooltip = document.getElementsByClassName('tooltip')[0];
  comment.style.cssText = 'display: none';
  tooltip.style.cssText = 'display: none;';
}
// 删除评论
function handleDeleteComment(index) {
  getFetch('/comment.delete', { index, file: querys.file || 'index' })
  .then(res => res.success ? window.location.reload() : null);
}