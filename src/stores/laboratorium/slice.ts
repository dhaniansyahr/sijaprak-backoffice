import { createSlice } from '@reduxjs/toolkit'
import { getAllRuanganLaboratorium } from './action'

interface IInitialState {
  isRefresh: boolean
}

const initialState: IInitialState = {
  isRefresh: false
}

export const laboratoriumSlice = createSlice({
  name: 'laboratorium',
  initialState,
  reducers: {
    setIsRefresh: state => {
      state.isRefresh = !state.isRefresh
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllRuanganLaboratorium.fulfilled, (state, action) => {
      state.isRefresh = true
    })
    builder.addCase(getAllRuanganLaboratorium.rejected, (state, action) => {
      state.isRefresh = true
    })
  }
})

export const { setIsRefresh } = laboratoriumSlice.actions

export default laboratoriumSlice.reducer
