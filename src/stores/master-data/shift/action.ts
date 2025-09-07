import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllShift = createAsyncThunk('getAll/Shift', async ({ data }: any, { rejectWithValue }) => {
  try {
    const response = await api.get('/master-data/shift', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getShift = createAsyncThunk('get/Shift', async ({ id }: { id: string }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/master-data/shift/${id}`)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createShift = createAsyncThunk('create/Shift', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/master-data/shift`, data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateShift = createAsyncThunk(
  'update/Shift',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/master-data/shift/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteShift = createAsyncThunk('delete/shift', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/master-data/shift`, data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
