import axios, { AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Intercept successful responses
api.interceptors.response.use(
  function (response) {
    return response
  },

  function (error) {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
