import { configureStore } from '@reduxjs/toolkit'

import auth from 'src/stores/auth/authSlice'
import ruanganLaboratorium from 'src/stores/master-data/ruangan/slice'
import shift from './master-data/shift/slice'
import jadwal from './jadwal/slice'
import asistenLab from './asisten-lab/slice'
import mahasiswa from './master-data/mahasiswa/slice'
import dosen from './master-data/dosen/slice'
import matakuliah from './master-data/mata-kuliah/slice'
import role from './role/slice'

export const store = configureStore({
  reducer: {
    auth,
    ruanganLaboratorium,
    shift,
    jadwal,
    asistenLab,
    mahasiswa,
    dosen,
    matakuliah,
    role
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
