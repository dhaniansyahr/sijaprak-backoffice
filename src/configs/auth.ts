export default {
  meEndpoint: '/verify-token',
  loginEndpoint: '/login',
  registerEndpoint: '/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
