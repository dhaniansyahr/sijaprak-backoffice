import { createSlice } from '@reduxjs/toolkit'
import { getAllJadwal } from './action'

interface IInitialState {
  isRefresh: boolean
}

const initialState: IInitialState = {
  isRefresh: false
}

export const jadwalSlice = createSlice({
  name: 'jadwal',
  initialState,
  reducers: {
    setIsRefresh: state => {
      state.isRefresh = !state.isRefresh
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllJadwal.fulfilled, (state, action) => {
      state.isRefresh = true
    })
    builder.addCase(getAllJadwal.rejected, (state, action) => {
      state.isRefresh = true
    })
  }
})

export const { setIsRefresh } = jadwalSlice.actions

export default jadwalSlice.reducer
