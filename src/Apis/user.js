import { axiospost } from './axios'

// 更新用户信息
export function userUpdate({nickname, avatar}) {
  return axiospost('/user/update', {nickname, avatar}, {loading: false})
}

// /user/userinfo 获取个人基本信息
export function getUserInfo() {
  return axiospost('/user/userinfo')
}
// 获取用户绑定的手机号和邮箱
export const getPhoneAndEmail = function (obj, headers) {
  return axiospost("/user/getUserPhoneAndEmailWithPin", obj, headers)
}
// 获取用户是否绑定google二次验证
export const getIsBindGoogleCode = function(obj) {
  return axiospost("/user/isBindGoogleCode", obj)
}
// 绑定手机或者邮箱
export const bindPhoneOrEmail = function (obj) {
  return axiospost("/user/bindPhoneOrEmail", obj)
}
// 绑定google二次验证
export const bindGoogleCode = function (obj) {
  return axiospost("/user/google_auth/bind", obj)
}
// 解绑google二次验证
export const unbindGoogleCode = function (obj) {
  return axiospost("/user/google_auth/unbind", obj)
}
// 验证google二次验证
export const googleVertify = function (obj) {
  return axiospost("/user/google_auth/verify", obj)
}
// 生成google二次验证二维码及秘钥
export const googleGenerate = function(obj) {
  return axiospost("/user/google_auth/generate", obj)
}
// 通过原登录密码 修改登录密码
export const updatePwdByPrePwd = function (obj) {
  return axiospost("/user/updatePwdByPrePwd", obj)
}
// 忘记原登录密码 修改登录密码
export const updatePwdByTxPwd = function (obj) {
  return axiospost("/user/updatePwdByTxPwd", obj)
}
// 通过原资金密码 修改资金密码
export const updateTxPwdByPreTxPwd = function (obj) {
  return axiospost("/user/updateTxPwdByPreTxPwd", obj)
}
// 通过登录密码 修改资金密码
export const updateTxPwdByPwd = function (obj) {
  return axiospost("/user/updateTxPwdByPwd", obj)
}
// 获取登录日志
export const getLoginLog = function (obj) {
  return axiospost("/user/login_records", obj)
}
// 获取登录日志详情
export const getLoginLogDetail = function (obj) {
  return axiospost("/user/login_record_detail", obj)
}
//  获取邀请人的邀请列表
export const inviteList = function (obj) {
  return axiospost("/user/invite_list", obj)
}
// 检查是否需要资金密码
export const checkRequireTxpwd = function (obj) {
  return axiospost('/user/check_txpwd_require', obj, {loading: false})
}
// /user/submit_kyc 用户提交实名认证信息
export const submitKyc = function (obj) {
  return axiospost('/user/submit_kyc', obj, {loading: true})
}
// /user/view_kyc 查看实名认证信息
export const viewKyc = function () {
  return axiospost('/user/view_kyc', {loading: false})
}
