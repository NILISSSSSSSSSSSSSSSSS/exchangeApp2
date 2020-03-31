import axios from 'axios'
import Store from '../Reducers/Index'
import {
  Toast
} from 'antd-mobile'
import { request } from '../Constants/Config'
const url = request[process.env.REACT_APP_ENV].httpUrl
// let url = 'https://api.arworld.ai'
let options = {
  baseURL: url,
  timeout: 20 * 1000,
  headers: {
    'Content-Type': 'application/json'
  }
}
let api = axios.create(options)
api.interceptors.request.use((config) => {
  let token = localStorage.token
  if (token) {
    config.headers.token = token
  }
  return config
}, (error) => {
  Toast.info('接口访问错误')
  return Promise.reject(error)
})

api.interceptors.response.use((response) => {
  if (!response.data.success) {
    if (response.data.errcode === 'ERR_UNAUTHORIZED' || response.data.errcode === 'API_SERVICE_ERROR_TOKEN') {
      //  跳转登录
      // showLoginHandle(true)
      Store.dispatch({type: 'SHOW_LOGIN', showLogin: true})
    }
    Toast.info(response.data.message)
  }
  return response
}, (error) => {
  Toast.info('接口访问错误')
  return Promise.reject(error)
})

export default api