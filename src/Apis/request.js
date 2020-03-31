import $http from '@/plugins/axios.js'

export const request = function () {
  return $http.get(`/api/requestWithToken`).then(res => {
    return Promise.resolve(res)
  })
}
