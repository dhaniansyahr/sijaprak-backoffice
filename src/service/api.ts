import axios from 'axios'
import authConfig from 'src/configs/auth'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

// Intercept successful responses
api.interceptors.response.use(
  function (response) {
    return response
  },

  async function (error) {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token

            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        // No refresh token available, redirect to login
        processQueue(error, null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userData')
        window.location.href = '/login'

        return Promise.reject(error)
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${authConfig.meEndpoint}`, {
          refreshToken: refreshToken
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data.content || response.data

        if (accessToken) {
          // Update stored tokens
          localStorage.setItem('accessToken', accessToken)
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }

          // Update default headers
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

          // Process the queue with the new token
          processQueue(null, accessToken)

          // Retry the original request with new token
          originalRequest.headers['Authorization'] = 'Bearer ' + accessToken

          return api(originalRequest)
        } else {
          throw new Error('No access token received from refresh')
        }
      } catch (refreshError) {
        // Refresh failed, clear auth data and redirect to login
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userData')

        // Clear API defaults
        delete api.defaults.headers.common['Authorization']

        window.location.href = '/login'

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
