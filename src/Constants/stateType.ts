
import io from 'socket.io-client'
import { request } from './Config'
const socketUrl = request[process.env.REACT_APP_ENV || 'test'].socketUrl
console.log(process.env.REACT_APP_ENV)
console.log(request[process.env.REACT_APP_ENV || 'test'].socketUrl)
//  站点信息
export type _siteInfo = {}
//  最近联系人列表
export type _currentListItem = {
  id: string
  date: string
  avatar: string
  message: string
}
export type _currentList = Array<_currentListItem>

//  资产货币
export type _assetListItem = {
  currency: string
  available: string
  value: string
}
export type _assetList = Array<_assetListItem>

//  币种链地址
export type _addressListItem = {
  primaryChain: string
  address: string
}
export type _addressList = Array<_addressListItem>

//  流水账
export type _recordsListItem = {
  currency: string
  reason: string
  bizId: string
  createTime: string
  changeAmount: string
  balance: string
}
export type _recordsList = Array<_recordsListItem>
//  系统参数
export type _system = {
  loading: boolean
  showLogin: boolean
  socket: any
}
//  用户信息
export type _user = {
  token: string
  vid: string
}
//  state对象
export type _state = {
  siteInfo: _siteInfo,
  currentList: _currentList,
  system: _system,
  user: _user
}

// ******** action ********* //
export type _action = {
  readonly type: string
  [propName: string]: any
}

export type _actionCreator = (param: any) => _action

// ******** reducer ********* //

export type _reducer = (state: _state, action: _action) => _state

export const defaultState: _state = {
  siteInfo: {},
  system: {
    loading: false,
    showLogin: false,
    socket: io(socketUrl)
  },
  user: {
    token: '',
    vid: ''
  },
  currentList: []
}