import { createSlice } from '@reduxjs/toolkit'
import { getAllMahasiswa } from './action'

interface IInitialState {
  isRefresh: boolean
}

const initialState: IInitialState = {
  isRefresh: false
}

export const mahasiswaSlice = createSlice({
  name: 'mahasiswa',
  initialState,
  reducers: {
    setIsRefresh: state => {
      state.isRefresh = !state.isRefresh
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllMahasiswa.fulfilled, (state, action) => {
      state.isRefresh = true
    })
    builder.addCase(getAllMahasiswa.rejected, (state, action) => {
      state.isRefresh = true
    })
  }
})

export const { setIsRefresh } = mahasiswaSlice.actions

export default mahasiswaSlice.reducer
