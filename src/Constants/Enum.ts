export const tradeType = [
  {value: 'buy', label: '买入'},
  {value: 'sell', label: '卖出'}
]

export const orderStatus = [
  {label: '等待放币', value: 'waitCoin'},
  {label: '等待付款', value: 'waitPay'},
  {label: '已完成', value: 'success'},
  {label: '已过期', value: 'expire'},
  {label: '已取消', value: 'cancel'}
]

export const appealType = [
  {label: '没有付款', value: 'no_pay'},
  {label: '没有支付虚拟币', value: 'no_coin'},
  {label: '没有响应', value: 'no_response'},
  {label: '恶意交易', value: 'spite'},
  {label: '其他', value: 'other'}
]