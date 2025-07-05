import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllDosen = createAsyncThunk('get/dosen', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.get('/users/dosen', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getDosen = createAsyncThunk(
  'get/dosen',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/dosen/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
