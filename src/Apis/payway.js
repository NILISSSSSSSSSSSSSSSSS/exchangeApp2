import { axiospost } from "./axios";

// 获取支付方式列表
export function paywayList() {
  return axiospost('/payway/list')
}
