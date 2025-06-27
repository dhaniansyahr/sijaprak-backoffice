export type TJadwal = {
  id: string
  day: string
  shiftId: string
  ruanganId: string
  dosenId: string
  asistenLabId?: null
  mahasiswaId?: null
  matakuliahId: string
  createdAt: string
  updatedAt: string
  deletedAt?: null
  ruangan: {
    id: string
    nama: string
    lokasi: string
    namaKepalaLab: string
    nipKepalaLab: string
    createdAt: string
    updatedAt: string
    deletedAt?: null
    histroyKepalaLabId: string
  }
  shift: {
    id: string
    startTime: string
    endTime: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    deletedAt?: null
  }
  dosen: {
    id: string
    nama: string
    email: string
    nip: string
    userId: string
    createdAt: string
    updatedAt: string
    asistenLabId?: null
  }
  matakuliah: {
    id: string
    nama: string
    kode: string
    type: string
    sks: number
    createdAt: string
    updatedAt: string
  }
}

export type TDetailJadwal = {
  id: string
  hari: string
  shiftId: string
  ruanganId: string
  dosenId: string
  semester: string
  tahun: string
  isOverride?: null
  asistenLabId?: null
  mahasiswaId?: null
  matakuliahId: string
  createdAt: string
  updatedAt: string
  deletedAt?: null
  dosen: {
    id: string
    nama: string
    email: string
    password: string
    nip: string
    userLevelId: string
    createdAt: string
    updatedAt: string
  }
  ruangan: {
    id: string
    nama: string
    lokasi: string
    namaKepalaLab: string
    nipKepalaLab: string
    createdAt: string
    updatedAt: string
    deletedAt?: null
    histroyKepalaLabId: string
  }
  shift: {
    id: string
    startTime: string
    endTime: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  asisten?: null
  Meeting: Array<{
    id: string
    jadwalId: string
    tanggal: string
    pertemuan: number
    createdAt: string
    updatedAt: string
  }>
}

export type TJadwalPayload = {
  matakuliahId: string
  dosenId: string
  ruanganId: string
  shiftId: string
  hari: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU'
  isOverride: boolean
}
