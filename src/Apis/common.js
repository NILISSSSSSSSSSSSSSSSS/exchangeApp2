import { axiospost } from './axios'

// 获取站点信息
export function getSiteInfo() {
  return axiospost('/common/siteinfo')
}

// 获取所有币种配置
export function getCurrencyConfig() {
  return axiospost('/common/all_currency')
}

// 查询指定币种的行情（包括各个交易所数据）
export function getCurrencyPriceAll(currencyIds) {
  return axiospost('/common/currency_quo', {
    currencyIds
  })
}

// 获取本所所支持的支付方式
export const getAllPaywayList = function(obj) {
  return axiospost('/common/all_legal_currency', obj)
}

//  通过IP获取国家 getCountryByIP
export const getCountryByIP = function(obj) {
  return axiospost('/common/ipinfo', obj)
}

//  文件上传
export const uploadFile = function (obj) {
  return axiospost('/common/img/upload', obj)
}
