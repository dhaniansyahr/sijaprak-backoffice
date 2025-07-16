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

export const getAllParticipantsAndMeetings = createAsyncThunk(
  'get/jadwal/participants-and-meetings',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jadwal/${id}/meetings-and-participants`)

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

export const updateMeeting = createAsyncThunk(
  'update/meeting',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jadwal/meeting/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const generateJawdal = createAsyncThunk('generate/jadwal', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post(`/jadwal/generate-all`)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

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

export const absent = createAsyncThunk('absent/jadwal', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/jadwal/absent`, data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

// Pendaftaran Asisten
export const daftarAsisten = createAsyncThunk(
  'daftar/asisten',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/pendaftaran-asisten-lab`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getAbsentNow = createAsyncThunk(
  'get/jadwal/absent-now',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jadwal/absent/now`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getAllScheduleToday = createAsyncThunk(
  'get/jadwal/schedule-today',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jadwal/today`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
