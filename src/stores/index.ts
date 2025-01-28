import { configureStore } from '@reduxjs/toolkit'

import auth from 'src/stores/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
