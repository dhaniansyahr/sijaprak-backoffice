import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllAbsensi = createAsyncThunk(
  'absensi/getAllAbsensi',
  async ({ data, jadwalId }: { data: any; jadwalId: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/absensi/jadwal/${jadwalId}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
