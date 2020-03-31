import axios from '../Tools/fetchApi'
export function axiosget(url, options, loading) {
  return axios.get(url, {
    params: options,
    loading: loading
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

export function axiospost(url, options, config) {
  return axios.post(url, options, config).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

export function axiosdelete(url, options, loading) {
  return axios.delete(url, {
    data: options,
    loading: loading
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

export function axiosput(url, options, config) {
  return axios.put(url, options, config).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })
}
