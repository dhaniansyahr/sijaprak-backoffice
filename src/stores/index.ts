import { configureStore } from '@reduxjs/toolkit'

import auth from 'src/stores/auth/authSlice'
import ruanganLaboratorium from 'src/stores/laboratorium/slice'
import shift from './shift/slice'
import jadwal from './jadwal/slice'

export const store = configureStore({
  reducer: {
    auth,
    ruanganLaboratorium,
    shift,
    jadwal
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
