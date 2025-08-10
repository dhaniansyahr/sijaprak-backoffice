import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllUsers = createAsyncThunk('get/users', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.get('/users', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getUser = createAsyncThunk('get/users', async ({ id }: { id: string }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/${id}`)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createUser = createAsyncThunk('create/users', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.post('/users', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateUser = createAsyncThunk(
  'get/users',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteUser = createAsyncThunk('delete/users', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.delete('/users', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})
