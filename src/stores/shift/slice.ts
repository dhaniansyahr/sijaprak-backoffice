import { createSlice } from '@reduxjs/toolkit'
import { getAllShift } from './action'

interface IInitialState {
  isRefresh: boolean
}

const initialState: IInitialState = {
  isRefresh: false
}

export const shiftSlice = createSlice({
  name: 'laboratorium',
  initialState,
  reducers: {
    setIsRefresh: state => {
      state.isRefresh = !state.isRefresh
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllShift.fulfilled, (state, action) => {
      state.isRefresh = true
    })
    builder.addCase(getAllShift.rejected, (state, action) => {
      state.isRefresh = true
    })
  }
})

export const { setIsRefresh } = shiftSlice.actions

export default shiftSlice.reducer
