function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatMinute(s){
  let m = parseInt(s/60);
  s = parseInt(s%60);
  if(m.toString().length == 1){
    m = "0"+m;
  }
  if(s.toString().length == 1){
    s = "0"+s;
  }
  return m+":"+s;
}

module.exports = {
  formatTime: formatTime,
  formatMinute: formatMinute
}
