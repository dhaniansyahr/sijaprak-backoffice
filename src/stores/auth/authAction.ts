import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const resetPassword = createAsyncThunk('reset-password', async (data: any, { rejectWithValue }) => {
  try {
    const response = await api.put('/reset-password', data)

    return response.data
  } catch (err) {
    return rejectWithValue(err)
  }
})
