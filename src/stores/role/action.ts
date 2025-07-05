import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllRole = createAsyncThunk('get/role', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.get('/user-levels', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const getAclByRole = createAsyncThunk(
  'get/acl-by-role',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/acl/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getAllFeauture = createAsyncThunk(
  'get/all-feature',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.get('/acl/features', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createRole = createAsyncThunk('create/role', async ({ data }: { data: any }, { rejectWithValue }) => {
  try {
    const response = await api.post('/acl', data)

    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const updateRole = createAsyncThunk(
  'update/role',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/acl/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
