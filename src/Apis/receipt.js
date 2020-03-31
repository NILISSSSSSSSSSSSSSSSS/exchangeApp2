import { axiospost } from './axios'

// 获取支付方式设置
export function getSettings() {
  return axiospost(`/receipt/v1/getSettings`)
}

// 获取支付方式设置
export const getPayType = function (obj) {
  return axiospost(`/receipt/v1/getSettings`, obj)
}
// 绑定支付方式
export const bindPayType = function (obj) {
  return axiospost(`/receipt/v1/bind`, obj)
}
// 启用/停用支付设置
export const changePayType = function (obj) {
  return axiospost(`/receipt/v1/change`, obj)
}
// 获取收款方支付方式
export const getPayway = function ({orderId}) {
  return axiospost('/otc/alert', {orderId})
}

// /otc/payInfo 拉取订单上记录的支付方式(仅字符串，不带详情)
export const getPayInfo = function ({id}) {
  return axiospost('/otc/payInfo', {id})
}
