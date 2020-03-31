//  定义action type常量
//  定义store
//  定义action函数

import {_action, _system, defaultState, _actionCreator} from '../Constants/stateType'

const SET_LOADING = 'SET_LOADING'
const SHOW_LOGIN = 'SHOW_LOGIN'
export default (state: _system = defaultState.system, action: _action) => {
  if (!state) {
    return
  }
  console.log(action)
  switch (action.type) {
    case SET_LOADING:
      console.log({...state, loading: action.loading})
      return {...state, loading: action.loading}
    case SHOW_LOGIN:
      return {...state, showLogin: action.showLogin}
    default:
      return state
  }
}

export const setLoading: _actionCreator = (loading: boolean) => {
  return {
    type: SET_LOADING,
    loading: loading
  }
}

export const showLoginHandle: _actionCreator = (showLogin: boolean) => {
  console.log(showLogin)
  return {
    type: SHOW_LOGIN,
    showLogin: showLogin
  }
}