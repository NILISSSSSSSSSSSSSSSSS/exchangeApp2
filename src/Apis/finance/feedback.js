import { legalUrl } from '@/plugins/config'
import { axiospost } from '../axios'

// 获取申述历史
export function getAppeals(page, pageSize) {
  return axiospost(`/appeal/list`, {
    page: page,
    limit: pageSize
  })
}

// 获取申述
export function getAppealById(id) {
  return axiospost(`/appeal/detail`, {
    id
  })
}

// 取消申述
export function appealCancel(orderId) {
  return axiospost(`/appeal/cancel`, {
    orderId
  })
}

// 订单投诉
export function orderComplaint(options) {
  return axiospost(`/appeal/add`, options);
}

// 获取申述类型
export function getAppealTypes() {
  return axiospost(`${legalUrl}/profile/v1/appealTypes`)
}
