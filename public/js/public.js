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

function postFetch(url, params) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(res => res.json());
}
// 获取当前时间并格式化
function getTime() {
  const currentTime = new Date();
  return `${currentTime.getFullYear()}-${currentTime.getMonth()}-${currentTime.getDate()} ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
}

// 改变样式文件
function handleChangeStyle() {
  let select = document.getElementById('selectCss');
  let cssValue = select.value;
  let pathname = window.location.pathname;
  let openURL = `${pathname}?css=${cssValue}`;
  if (pathname === '/'){
    openURL += `&file=${querys.file || 'index'}`;
  }
  window.location.href = openURL;
}