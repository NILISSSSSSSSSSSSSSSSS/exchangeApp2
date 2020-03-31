import { axiospost } from './axios'

// 根据法币和语言获取行情 - 侧边
export function quotes(obj) {
  return axiospost(`/quotes/v1/find`, obj)
}
// 广告查询
export function adQueryVip(obj) {
  return axiospost(`/shop/c2c_list`, obj)
}
// 创建订单
export function createOrder(obj) {
  return axiospost(`/c2c/place`, obj, {loading: true})
}
// 获取最新订单
export function getHotOrders(obj) {
  return axiospost(`/v1/hotOrders`, obj)
}

// 订单投诉
export function orderComplaint(options) {
  return axiospost(`/appeal/add`, options);
}

// /appeal/list 申述历史列表
export function appealList(options) {
  return axiospost(`/appeal/list`, options);
}

// /appeal/detail 获取申述详情
export function appealDetail(options) {
  return axiospost(`/appeal/detail`, options);
}