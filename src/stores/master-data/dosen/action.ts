import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllDosen = createAsyncThunk('get/dosen', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.get('/master-data/dosen', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getDosen = createAsyncThunk(
  'get/dosen',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/master-data/dosen/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createDosen = createAsyncThunk('create/dosen', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.post('/master-data/dosen', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateDosen = createAsyncThunk(
  'update/dosen',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/master-data/dosen/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteDosen = createAsyncThunk('delete/dosen', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/master-data/dosen`, data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
