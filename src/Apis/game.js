import { axiospost } from './axios'

//  查询游戏列表
export const gameList = function (lang) {
  return axiospost(`/game/gameList`)
}

// 查询用户币种余额
export const getCurrencyBalance = function (currency) {
  return axiospost('/game/user/currencyAmount', currency)
}

// 发起投注订单
export const createOrder = function (obj) {
  return axiospost('/game/user/createOrder', obj)
}

// 查询投注历史
export const queryBetHistory = function (obj) {
  return axiospost('/game/queryOrder', obj)
}

// 查询投注历史带token
export const queryBetHistoryToken = function (obj) {
  return axiospost('/game/user/queryOrder', obj)
}

// 查询分红记录
export const queryShareHistory = function (obj) {
  return axiospost('/game/queryShareRecord', obj)
}

// 查询分红记录带token
export const queryShareHistoryToken = function (obj) {
  return axiospost('/game/user/queryShareRecord', obj)
}

// 查询奖金记录
export const queryRewardHistory = function (obj) {
  return axiospost('/game/queryRewardRecord', obj)
}

// 查询奖金记录带token
export const queryRewardHistoryToken = function (obj) {
  return axiospost('/game/user/queryRewardRecord', obj)
}
// 查询邀请奖励记录
export const queryInviteReward = function (obj) {
  return axiospost('/game/user/queryInviteRecord', obj)
}

// 查询用户收益
export const queryUserIncome = function (obj) {
  return axiospost('/game/user/queryUserIncome', obj)
}

// 查询大奖预期
export const queryExpectReward = function (obj) {
  return axiospost('/game/queryExpectReward', obj)
}

//  查询用户个人游戏页面
export const queryUserGameTotalInfo = function (obj) {
  return axiospost('/game/user/queryUserGameTotalInfo', obj)
}
