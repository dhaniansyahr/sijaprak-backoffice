import { createSlice } from '@reduxjs/toolkit'
import { getAllRole } from './action'

interface IInitialState {
  isRefresh: boolean
}

const initialState: IInitialState = {
  isRefresh: false
}

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setIsRefresh: state => {
      state.isRefresh = !state.isRefresh
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllRole.fulfilled, (state, action) => {
      state.isRefresh = true
    })
    builder.addCase(getAllRole.rejected, (state, action) => {
      state.isRefresh = true
    })
  }
})

export const { setIsRefresh } = roleSlice.actions

export default roleSlice.reducer
