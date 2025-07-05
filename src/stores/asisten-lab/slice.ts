import { createSlice } from '@reduxjs/toolkit'
import { getAsistenLab } from './action'

interface IInitialState {
  isRefresh: boolean
}

const initialState: IInitialState = {
  isRefresh: false
}

export const asistenLabSlice = createSlice({
  name: 'asistenLab',
  initialState,
  reducers: {
    setIsRefresh: state => {
      state.isRefresh = !state.isRefresh
    }
  },
  extraReducers: builder => {
    builder.addCase(getAsistenLab.fulfilled, (state, action) => {
      state.isRefresh = true
    })
    builder.addCase(getAsistenLab.rejected, (state, action) => {
      state.isRefresh = true
    })
  }
})

export const { setIsRefresh } = asistenLabSlice.actions

export default asistenLabSlice.reducer
