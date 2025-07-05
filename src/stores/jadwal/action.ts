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

export const getAvailableJadwal = createAsyncThunk(
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

export const generateJawdal = createAsyncThunk('generate/jadwal', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post(`/jadwal/generate-all`)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getAllMataKuliah = createAsyncThunk(
  'get/mata-kuliah',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jadwal/mata-kuliah`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// Pertemuan
export const getAllMeetings = createAsyncThunk(
  'get/meetings',
  async ({ jadwalId, data }: { jadwalId: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/meeting/jadwal/${jadwalId}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getAbsensi = createAsyncThunk('get/absensi', async ({ id }: { id: string }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/meeting/jadwal/${id}/participants`)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const absent = createAsyncThunk('absent/jadwal', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/absensi`, data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
