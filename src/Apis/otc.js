import { axiospost } from './axios'

// 买入
export function otcBuyIn({ adId, tradeCurrencyAmount }) {
  //  接口变更传参减少
  return axiospost('/otc/place', { adId, tradeCurrencyAmount }, { loading: false })
}

// 卖出
export function otcSellOut({ adId, tradeCurrencyAmount }) {
  //  接口变更传参减少
  return axiospost('/otc/place', { adId, tradeCurrencyAmount }, { loading: false })
}

// 获取我的订单
export function myOrder({ queryType, limit = 10, page = 0 }) {
  return axiospost('/otc/my_order', { queryType, limit, page })
}

// OTC成交记录
export function otcHistory({ isC2C, tradeType, orderStatus, startDate, endDate, page, limit, orderCode }) {
  return axiospost('/otc/otc_history', { isC2C, tradeType, orderStatus, startDate, endDate, page, limit, orderCode })
}

// /otc/order_detail 订单详情
export function orderDetail (obj) {
  return axiospost('/otc/order_detail', obj)
}
