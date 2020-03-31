import { axiosget, axiospost } from '../axios'

// 查询充值记录
export function depositRecords(obj) {
  return axiospost('/transaction/deposit_records', obj)
}

// 查询提币记录
export function withdrawRecords(obj) {
  return axiospost('/transaction/withdraw_records', obj)
}

// 提币页面展示的信息
export function preWithdraw(obj) {
  return axiospost('/transaction/pre_withdraw', obj)
}

// 提币
export function withdraw({currencyId, amount, to, assestsPass, code, desc}) {
  return axiospost('/transaction/withdraw', {currencyId, amount, to, assestsPass, code, desc}, {loading: false})
}
