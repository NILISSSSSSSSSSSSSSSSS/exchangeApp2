import { axiospost } from './axios'

// 汇率相对USD
export function exchangeRate(symbol) {
  return axiospost('/information/exchange_rate', {symbol})
}

// 多个汇率相对USD
export function exchangeRateAll(obj) {
  return axiospost('/information/exchange_rate_all', obj)
}
