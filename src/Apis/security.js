import {axiospost} from './axios'

// 获取支付方式列表
export const getPayType = function (obj) {
  return axiospost(`/payway/list`, obj)
}
// 保存支付方式
export const bindPayType = function (obj) {
  return axiospost(`/payway/save`, obj)
}
// 修改支付方式状态
export const changePayType = function (obj) {
  return axiospost(`/payway/status`, obj)
}

// 获取法币配置
export function getFiatCurrencyConfig(obj) {
  return axiospost('/common/currency/getLegals', obj)
}

// // 获取用户绑定的手机号和邮箱
// export const getPhoneAndEmail = function (obj, headers) {
//   return axiospost("/user/getUserPhoneAndEmailWithPin", obj, headers)
// }
// // 获取用户是否绑定google二次验证
// export const getIsBindGoogleCode = function(obj) {
//   return axiospost("/user/isBindGoogleCode", obj)
// }
// // 绑定手机或者邮箱
// export const bindPhoneOrEmail = function (obj) {
//   return axiospost("/user/bindPhoneOrEmail", obj)
// }
// // 获取验证码
// export const getVertifyCode = function(obj) {
//   return axiospost("/default/sendVerifyCodeWithServiceName", obj)
// }
// // 绑定google二次验证
// export const bindGoogleCode = function (obj) {
//   return axiospost("/user/google_auth/bind", obj)
// }
// // 解绑google二次验证
// export const unbindGoogleCode = function (obj) {
//   return axiospost("/user/google_auth/unbind", obj)
// }
// // 验证google二次验证
// export const googleVertify = function (obj) {
//   return axiospost("/user/google_auth/verify", obj)
// }
// // 生成google二次验证二维码及秘钥
// export const googleGenerate = function(obj) {
//   return axiospost("/user/google_auth/generate", obj)
// }
// // 通过原登录密码 修改登录密码
// export const updatePwdByPrePwd = function (obj) {
//   return axiospost("/user/updatePwdByPrePwd", obj)
// }
// // 忘记原登录密码 修改登录密码
// export const updatePwdByTxPwd = function (obj) {
//   return axiospost("/user/updatePwdByTxPwd", obj)
// }
// // 通过原资金密码 修改资金密码
// export const updateTxPwdByPreTxPwd = function (obj) {
//   return axiospost("/user/updateTxPwdByPreTxPwd", obj)
// }
// // 通过登录密码 修改资金密码
// export const updateTxPwdByPwd = function (obj) {
//   return axiospost("/user/updateTxPwdByPwd", obj)
// }
// // 获取支付方式设置
// export const getPayType = function (obj) {
//   return axiospost(`${url}/receipt/v1/getSettings`, obj)
// }
// // 绑定支付方式
// export const bindPayType = function (obj) {
//   return axiospost(`${url}/receipt/v1/bind`, obj)
// }
// // 启用/停用支付设置
// export const changePayType = function (obj) {
//   return axiospost(`${url}/receipt/v1/change`, obj)
// }
// // 获取登录日志
// export const getLoginLog = function (obj) {
//   return axiospost("/user/login_records", obj)
// }
// // 获取登录日志详情
// export const getLoginLogDetail = function (obj) {
//   return axiospost("/user/login_record_detail", obj)
// }
