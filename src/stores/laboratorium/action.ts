import { createAsyncThunk } from '@reduxjs/toolkit'
import api from 'src/service/api'

export const getAllRuanganLaboratorium = createAsyncThunk(
  'getAll/ruanganLaboratorium',
  async ({ data }: any, { rejectWithValue }) => {
    try {
      const response = await api.get('/ruangan-laboratorium', data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getRuanganLaboratorium = createAsyncThunk(
  'get/ruanganLaboratorium',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/ruangan-laboratorium/${id}`)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createRuanganLaboratorium = createAsyncThunk(
  'create/ruanganLaboratorium',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/ruangan-laboratorium`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateRuanganLaboratorium = createAsyncThunk(
  'update/ruanganLaboratorium',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/ruangan-laboratorium/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const assignKepalaLab = createAsyncThunk(
  'assign/ruanganLaboratorium',
  async ({ data, id }: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/ruangan-laboratorium/assign-kepala-lab/${id}`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteRuanganLaboratorium = createAsyncThunk(
  'delete/ruanganLaboratorium',
  async ({ data }: { data: any }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/ruangan-laboratorium`, data)

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
