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

export const getAllJadwalForPendaftaran = createAsyncThunk(
  'get/asisten-lab',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.get('/asisten-lab/pendaftaran/jadwal', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getAsistenLabByJadwalId = createAsyncThunk(
  'get/asisten-lab-by-jadwal-id',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/asisten-lab/jadwal/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getPendaftaranAsistenLab = createAsyncThunk(
  'create/asisten-lab',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.get('/asisten-lab/pendaftaran', data)

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
      const response = await api.put(`/asisten-lab/${id}/penerimaan`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const assignAsistenLab = createAsyncThunk(
  'create/asisten-lab',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/asisten-lab/${id}/assign`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
