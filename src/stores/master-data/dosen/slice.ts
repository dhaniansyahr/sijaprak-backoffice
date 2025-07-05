import { createSlice } from '@reduxjs/toolkit'
import { getAllDosen } from './action'

interface IInitialState {
  isRefresh: boolean
}

const initialState: IInitialState = {
  isRefresh: false
}

export const dosenSlice = createSlice({
  name: 'dosen',
  initialState,
  reducers: {
    setIsRefresh: state => {
      state.isRefresh = !state.isRefresh
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllDosen.fulfilled, (state, action) => {
      state.isRefresh = true
    })
    builder.addCase(getAllDosen.rejected, (state, action) => {
      state.isRefresh = true
    })
  }
})

export const { setIsRefresh } = dosenSlice.actions

export default dosenSlice.reducer
