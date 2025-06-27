import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllJadwal = createAsyncThunk('get/Jadwal', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.get('/jadwal', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getJadwal = createAsyncThunk('get/jadwal', async ({ id }: { id: string }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/jadwal/${id}`)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getSummaryJadwal = createAsyncThunk('get/jadwal', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/jadwal/summary`, data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const checkFreeJadwal = createAsyncThunk(
  'check/jadwal',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jadwal/check`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createJadwal = createAsyncThunk('create/jadwal', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/jadwal`, data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateJadwal = createAsyncThunk(
  'update/jadwal',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jadwal/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteJadwal = createAsyncThunk('delete/jadwal', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/jadwal`, data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const generateJawdal = createAsyncThunk(
  'generate/jadwal',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jadwal/generate`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
