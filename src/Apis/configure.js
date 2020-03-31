import { axiospost } from './axios'

//  获取支持的法币列表
export function legalList () {
  return axiospost('/configure/legal_currency/list')
}

//  获取支持的数字币列表
export function currencyList () {
  return axiospost('/configure/currency/list')
}

// 获取所有的法币配置(包含支付配置)
export function getAllLegalCurrency () {
  return axiospost('/common/all_legal_currency')
}

// 获取所有的法币配置(包含支付配置)
export function getConfigureCurrencyInfo ({ids}) {
  return axiospost('/configure/currency/info', {ids})
}
