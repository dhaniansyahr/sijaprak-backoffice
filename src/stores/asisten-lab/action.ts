import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAsistenLab = createAsyncThunk(
  'get/asisten-lab',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.post('/asisten-lab', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getAsistenLabByJadwalId = createAsyncThunk(
  'get/asisten-lab-by-jadwal-id',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.post('/asisten-lab/jadwal', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const pendaftaranAsistenLab = createAsyncThunk(
  'create/asisten-lab',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.post('/asisten-lab/pendaftaran', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const penerimaanAsistenLab = createAsyncThunk(
  'create/asisten-lab',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/asisten-lab/${id}/penerimaan`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const assignAsistenLab = createAsyncThunk(
  'create/asisten-lab',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/asisten-lab/${id}/assign`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
