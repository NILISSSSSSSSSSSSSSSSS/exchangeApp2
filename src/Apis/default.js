import {axiospost} from './axios'

// 获取验证码
export const getVertifyCode = function(obj) {
  return axiospost("/default/sendVerifyCodeWithServiceName", obj)
}

// 获取验证码带token，绑定担保人
export const getVertifyCodeWithToken = function(obj) {
  return axiospost("/user/sendVerifyCodeWithServiceName", obj)
}

// /default/login 用户登录
export const login = function(obj) {
  return axiospost("/default/login", obj)
}

// /default/register 用户注册
export const register = function(obj) {
  return axiospost("/default/register", obj)
}

//  /default/checkPhoneOrEmailExist 验证手机或邮箱是否已经被使用
export const isExist = function(obj) {
  return axiospost("/default/checkPhoneOrEmailExist", obj)
}