import { axiospost } from './axios'

// /account/asset 账户所有币种资金列表
export function accountList(obj) {
  return axiospost('/account/asset', obj)
}

// 用户的流水账
export function accountJournal(obj) {
  return axiospost('/account/records', obj)
  // return axiospost('/account/journal', {currency, bizId, bizType, startTime, endTime, page, limit})
}

// 查询某币种的充值地址
export function depositsAddress(currencyId) {
  return axiospost('/account/deposits_wallets', {
    currencyId: currencyId
  })
}
