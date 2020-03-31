export const currencyFormate = (num) => {
  num = Number(num)
  if (isNaN(num)) {
    return '-'
  }
  return parseFloat(num.toFixed(4))
}

export const fiatFormate = (num) => {
  num = Number(num)
  if (isNaN(num)) {
    return '-'
  }
  return parseFloat(num.toFixed(2))
}

export const fiatSymbol = (fiat) => {
  switch (fiat) {
    case 'CNY':
      return '¥'
    case 'USD':
      return '$'
    default:
      return '-'
  }
}

// _时间格式化
function _formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _padLeftZero(str));
    }
  }
  return fmt;
};
// _时间格式化
function _padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

// 时间格式化
export const formatDate = (s, type) => {
  type = type || "hh:mm MM/dd"
  var date = new Date(s);
  return _formatDate(date, type);
}

// 小数转百分比
export const floatTopercent = (n) => {
  n = Number(n)
  if (isNaN(n)) return ''
  return (n * 100).toFixed(2) + '%'
}

// 币币交易对格式转换 /
export const formatePairName = (s) => {
  if (s && s.indexOf('_') > -1){
    return s.replace('_', '/')
  }
  return s
}

//  方向
export const direction = (s) => {
  switch(s) {
    case 'buy':
      return '买入'
    case 'sell':
      return '卖出'
    default:
      return '未知'
  }
}
//  充值状态
export const depositsStatus = (s) => {
  const enumList = {
    "1": "等待确认",
    "2": "充值失败",
    "3": "充值成功"
  }
  return enumList[s]
}

//  提币状态
export const withdrawStatus = (s) => {
  const enumList = {
    "1": "初始化",
    "2": "已广播",
    "3": "等待确认",
    "4": "提币成功",
    "5": "等待审核",
    "6": "提币失败",
    "7": "审核不通过"
  }
  return enumList[s]
}

export const withdrawRequest = (s) => {
  const enumList = {
    "APPROVAL": "提币进入审核",
    "SUCCESS": "提币成功"
  }
  return enumList[s]
}

export const orderStatusFilter = (s) => {
  const enumList = {
    "init": "初始化",
    "waitPay": "等待付款",
    "waitCoin": "等待放币",
    "success": "交易成功",
    "expire": "交易过期",
    "cancel": "交易取消"
  }
  return enumList[s]
}