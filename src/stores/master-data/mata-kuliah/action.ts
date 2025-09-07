import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllMatakuliah = createAsyncThunk(
  'get/Matakuliah',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.get('/master-data/mata-kuliah', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getMatakuliah = createAsyncThunk(
  'get/Matakuliah',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/master-data/mata-kuliah/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createMatakuliah = createAsyncThunk(
  'create/Matakuliah',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.post('/master-data/mata-kuliah', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateMatakuliah = createAsyncThunk(
  'update/Matakuliah',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/master-data/mata-kuliah/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteMatakuliah = createAsyncThunk(
  'delete/Matakuliah',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/master-data/mata-kuliah`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
