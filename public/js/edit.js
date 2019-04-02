// 监听键盘事件
document.addEventListener("keyup", keyUp, true);
function keyUp() {
  let textareaEdit = document.getElementsByClassName('editInput')[0];
  let content = document.getElementsByClassName('content')[0];
  let text = textareaEdit.value;
  let lines = text.match(/(\r\n)|(\n)/g) ? text.match(/(\r\n)|(\n)/g).length + 1 : 1;
  setLinesNumber(lines);
  postFetch('/md.edit', {
    file: querys.file,
    text: text,
  }).then(res => res.success ? content.innerHTML = res.text : alert('编辑出错'));
}
// 行号插入
function setLinesNumber(count) {
  let textareaLines = document.getElementsByClassName('number')[0];
  let textareaEdit = document.getElementsByClassName('editInput')[0];
  let innerSpan = '';
  for(let index = 0; index < count; index ++) {
    innerSpan += `<span>${index+1}</span>`;
  }
  textareaLines.innerHTML = innerSpan;
  textareaEdit.addEventListener("scroll", function() {
    textareaLines.style.marginTop = -textareaEdit.scrollTop + 'px';
  });
}
window.onload = () => {
  let textareaEdit = document.getElementsByClassName('editInput')[0];
  let text = textareaEdit.value;
  let lines = text.match(/(\r\n)|(\n)/g) ? text.match(/(\r\n)|(\n)/g).length + 1 : 1;
  setLinesNumber(lines);
};
// 修改文件名
function handleEditName() {
  let newName = document.getElementsByClassName('editName')[0].value;
  postFetch('/name.edit', {
    file: querys.file,
    name: newName,
  }).then(res => res.success ? null : alert('修改出错'));
}