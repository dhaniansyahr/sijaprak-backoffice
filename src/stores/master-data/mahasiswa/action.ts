import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllMahasiswa = createAsyncThunk(
  'get/Mahasiswa',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/mahasiswa', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getMahasiswa = createAsyncThunk(
  'get/Mahasiswa',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/mahasiswa/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
