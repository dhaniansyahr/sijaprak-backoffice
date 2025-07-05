export default {
  meEndpoint: '/verify-token',
  loginEndpoint: '/login',
  registerEndpoint: '/register',
  refreshEndpoint: '/refresh-token',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
