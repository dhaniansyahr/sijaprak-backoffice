import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllMataKuliah = createAsyncThunk('get/Matakuliah', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.get('/mata-kuliah', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
