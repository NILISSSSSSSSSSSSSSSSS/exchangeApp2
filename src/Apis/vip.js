import { axiospost } from './axios'
import { legalUrl as url } from '@/plugins/config'

// 获取商户认证信息
export function vipInfo() {
  return axiospost(`${url}/vip/v1/info`)
}

// 获取商户认证状态
export function vipStatus() {
  return axiospost(`${url}/vip/v1/status`)
}

// 获取商户证件信息
export function vipPhotos() {
  return axiospost(`${url}/vip/v1/photos`)
}

// 提交商户认证
export function vipSubmit(images) {
  return axiospost(`${url}/vip/v1/submit`, { images })
}

// 获取商户储备金锁定量，及是否满足
export function vipReserve() {
  return axiospost(`${url}/vip/v1/reserve`)
}
