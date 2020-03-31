import { axiospost } from './axios'

// 我的广告
// adStatus: online, offline, expire, cancel
export function adQuery({ status, limit, page }) {
  return axiospost(`/shop/mine`, { status, limit, page })
}

// 广告上架
export function upAd({ adId, currencyAmount }) {
  return axiospost(`/shop/save`, { adId, currencyAmount })
}

// 广告删除
export function adCancel({ id, status }) {
  return axiospost(`/shop/cancel`, { id, status }, { loading: false })
}

// 批量删除
export function adCancelAll(ids) {
  return axiospost(`/shop/batch_cancel`, { ids }, { loading: false })
}

// 广告下架
export function adUnpub({ id, status }) {
  return axiospost(`/shop/unpub`, { id, status })
}

// otc广告列列表
export function adListOTC({ currencyId, legalCurrency, tradeType, page, limit }) {
  return axiospost('/shop/otc_list', { currencyId, legalCurrency, tradeType, page, limit })
}

// 发布广告
export function adsSave({ currencyId, legalCurrency, tradeType, acceptC2C, quotationSource, overPercent, priceLimit,
  count, countMinLimit, countMaxLimit, orderMaxLimit, payWay, autoReplyMessage, id }) {
  return axiospost('/shop/save', { currencyId, legalCurrency, tradeType, acceptC2C, quotationSource, overPercent: overPercent, priceLimit, count, countMinLimit, countMaxLimit, orderMaxLimit, payWay, autoReplyMessage, id }, { loading: false })
}

// 查询单条广告
export function queryOneAd(id) {
  return axiospost('/shop/query', { id }, { loading: false })
}
