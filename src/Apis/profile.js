import { axiospost } from './axios'
import { legalUrl as url } from '@/plugins/config'

// 获取成为VIP需要USDT数量
export function reserve() {
  return axiospost(`${url}/profile/v1/reserve`)
}
