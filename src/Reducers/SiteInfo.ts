//  定义action type常量
//  定义store
//  定义action函数
import {_siteInfo, defaultState, _action, _actionCreator} from '../Constants/stateType'
const SET_SITEINFO = 'SET_SITEINFO'

export default (state: _siteInfo = defaultState.siteInfo, action: _action): _siteInfo => {
  if (!state) {
    return {}
  }
  console.log(action)
  switch (action.type) {
    case SET_SITEINFO:
      return action.siteInfo
    default:
      return state
  }
}

export const setSiteInfo: _actionCreator = (siteInfo: _siteInfo) => {
  return {
    type: SET_SITEINFO,
    siteInfo: siteInfo
  }
}