import { createSlice } from '@reduxjs/toolkit'
import { getAllUsers } from './action'

interface IInitialState {
  isRefresh: boolean
}

const initialState: IInitialState = {
  isRefresh: false
}

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setIsRefresh: state => {
      state.isRefresh = !state.isRefresh
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.isRefresh = true
    })
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.isRefresh = true
    })
  }
})

export const { setIsRefresh } = userSlice.actions

export default userSlice.reducer
