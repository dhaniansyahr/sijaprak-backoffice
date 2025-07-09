import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Button
} from '@mui/material'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { Icon } from '@iconify/react'
import api from 'src/service/api'
import Can from 'src/layouts/components/acl/Can'
import { DataGrid, gridClasses } from '@mui/x-data-grid'

interface DashboardData {
  totalStudents: number
  totalDosen: number
  totalCourses: number
  totalSchedules: number
  studentsBySemester: Array<{ name: string; value: number; fill: string }>
  coursesByBidangMinat: Array<{ name: string; value: number; fill: string }>
  courseTypeDistribution: Array<{ name: string; value: number; fill: string }>
  monthlyEnrollmentTrend: Array<{ date: string; value: number }>
  assistantApplicationsTrend: Array<{ date: string; value: number }>
  weeklyScheduleDensity: Array<{ name: string; morning: number; afternoon: number; evening: number }>
  roomUtilizationRadar: Array<{ subject: string; A: number; B: number; fullMark: number }>
  courseHierarchy: Array<{ name: string; children: Array<{ name: string; size: number; fill: string }> }>
  assistantApplicationStatus: Array<{ name: string; value: number; fill: string }>
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          padding: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}
      >
        <Typography variant='body2' fontWeight='bold'>
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography key={index} variant='body2' color={entry.color}>
            {entry.name}: {entry.value}
          </Typography>
        ))}
      </Box>
    )
  }

  return null
}

// Stats Card Component
const StatsCard = ({ title, value, icon, color, subtitle }: any) => (
  <Card>
    <CardContent>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box>
          <Typography variant='h4' fontWeight='bold'>
            {value?.toLocaleString()}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant='caption' color='text.secondary'>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar
          sx={{
            backgroundColor: color,
            width: 56,
            height: 56
          }}
        >
          <Icon icon={icon} width={24} height={24} />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
)

// Pie Chart Component
const PieChartCard = ({ title, data, height = 300 }: any) => (
  <Card>
    <CardHeader title={title} />
    <CardContent>
      <ResponsiveContainer width='100%' height={height}>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
          >
            {data?.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

// Line Chart Component
const LineChartCard = ({ title, data, dataKey, height = 300 }: any) => (
  <Card>
    <CardHeader title={title} />
    <CardContent>
      <ResponsiveContainer width='100%' height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type='monotone' dataKey={dataKey} stroke='#8884d8' strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

// Bar Chart Component
const BarChartCard = ({ title, data, height = 300 }: any) => (
  <Card>
    <CardHeader title={title} />
    <CardContent>
      <ResponsiveContainer width='100%' height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey='morning' fill='#8884d8' name='Morning' />
          <Bar dataKey='afternoon' fill='#82ca9d' name='Afternoon' />
          <Bar dataKey='evening' fill='#ffc658' name='Evening' />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

// Radar Chart Component
const RadarChartCard = ({ title, data, height = 300 }: any) => (
  <Card>
    <CardHeader title={title} />
    <CardContent>
      <ResponsiveContainer width='100%' height={height}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey='subject' />
          <PolarRadiusAxis />
          <Radar name='Utilization' dataKey='A' stroke='#8884d8' fill='#8884d8' fillOpacity={0.6} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

// Course Hierarchy as Bar Chart (alternative to Treemap)
const CourseHierarchyCard = ({ title, data, height = 300 }: any) => {
  // Flatten hierarchy data for bar chart
  const flattenedData =
    data?.flatMap(
      (category: any) =>
        category.children?.map((child: any) => ({
          name: `${category.name} - ${child.name}`,
          value: child.size,
          fill: child.fill
        })) || []
    ) || []

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <ResponsiveContainer width='100%' height={height}>
          <BarChart data={flattenedData} layout='horizontal'>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis type='number' />
            <YAxis dataKey='name' type='category' width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey='value' fill='#8884d8' />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Application Status Component
const ApplicationStatusCard = ({ data }: any) => (
  <Card>
    <CardHeader
      title='Assistant Application Status'
      action={
        <Box display='flex' gap={2} flexWrap='wrap'>
          {data?.map((item: any, index: number) => (
            <Chip
              key={index}
              label={`${item.name}: ${item.value}`}
              sx={{
                backgroundColor: item.fill,
                color: 'white',
                fontWeight: 'bold'
              }}
              size='medium'
            />
          ))}
        </Box>
      }
    />
  </Card>
)

const ScheduleOverview = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)

  const columns = [
    {
      flex: 0.25,
      field: 'no',
      headerName: 'No',
      maxWidth: 100,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.api.getAllRowIds().indexOf(params.id) + 1}</span>
      }
    },
    {
      flex: 0.25,
      field: 'mk',
      headerName: 'Mata Kuliah',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.row?.mataKuliah?.nama ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'dosen',
      headerName: 'Dosen',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.row?.dosen?.nama ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'namaRuangan',
      headerName: 'Nama Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.row?.ruangan?.nama ?? '-'}</span>
      }
    },
    {
      flex: 0.25,
      field: 'lokasi',
      headerName: 'Lokasi Ruangan',
      minWidth: 160,
      sortable: false,
      renderCell: (params: any) => {
        return <span>{params.row?.ruangan?.lokasi ?? '-'}</span>
      }
    }
  ]

  const handleGetData = async () => {
    setIsLoading(true)

    setData({
      entries: [
        {
          index: 1,
          mataKuliah: {
            nama: 'Pemrograman Web'
          },
          dosen: {
            nama: 'Dr. Budi Santoso'
          },
          ruangan: {
            nama: 'Lab Komputer 1',
            lokasi: 'Gedung A Lt. 3'
          }
        },
        {
          index: 2,
          mataKuliah: {
            nama: 'Basis Data'
          },
          dosen: {
            nama: 'Dr. Siti Aminah'
          },
          ruangan: {
            nama: 'Lab Database',
            lokasi: 'Gedung B Lt. 2'
          }
        },
        {
          index: 3,
          mataKuliah: {
            nama: 'Jaringan Komputer'
          },
          dosen: {
            nama: 'Dr. Ahmad Wijaya'
          },
          ruangan: {
            nama: 'Lab Networking',
            lokasi: 'Gedung A Lt. 4'
          }
        }
      ],
      totalData: 3,
      totalPages: 1
    })

    setIsLoading(false)
  }

  useEffect(() => {
    handleGetData()
  }, [])

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        title={
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 500 }}>
              Jadwal Hari ini
            </Typography>
          </Box>
        }
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'start', md: 'center' },
          borderBottom: '1px solid #f4f4f4'
        }}
      />

      <CardContent sx={{ paddingY: '16px' }}>
        <DataGrid
          autoHeight
          rows={data?.entries ?? []}
          columns={columns}
          hideFooter
          getRowId={row => row.index}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          rowCount={data?.totalData ?? 0}
          loading={isLoading}
          slots={{
            loadingOverlay: CircularProgress
          }}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 1
            }
          }}
        />
      </CardContent>
    </Card>
  )
}

const IncomingAbsent = () => {
  return (
    <Card>
      <CardHeader
        title={
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 500 }}>
              Absensi yang akan datang
            </Typography>
          </Box>
        }
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'start', md: 'center' },
          borderBottom: '1px solid #f4f4f4'
        }}
      />

      <CardHeader
        title={
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 500 }}>
              Rekayasa Perangkat Lunak - Pertemuan Ke 1
            </Typography>
          </Box>
        }
        action={<Button variant='contained'>Absen</Button>}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'start', md: 'center' }
        }}
      />

      <CardContent sx={{ marginTop: '16px' }}>
        <Grid container spacing={4}>
          {[
            {
              field: 'Mata Kuliah',
              value: 'Rekayasa Perangkat Lunak'
            },
            {
              field: 'Dosen Pengajar',
              value: 'Dosen 1'
            },
            {
              field: 'Tanggal',
              value: '01 Januari 2025'
            },
            {
              field: 'Ruangan',
              value: 'Laboratorium Rekayasa Perangkat Lunak'
            },
            {
              field: 'Waktu',
              value: '08:00 - 09:40 WIB'
            },
            {
              field: 'Pertemuan',
              value: '01'
            }
          ].map((item: any, index: number) => (
            <Grid item xs={6} key={index}>
              <Grid container spacing={2} borderBottom={'1px solid #4c4e6438'} paddingBottom={'16px'}>
                <Grid item xs={4}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    {item.field}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='body1'>{item.value}</Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default function EnhancedDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get('/dashboard')
      setDashboardData(response.data.content)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!dashboardData) {
    return (
      <Alert severity='info' sx={{ mb: 2 }}>
        No dashboard data available
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Can I='read' a='DASHBOARD'>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title='Total Students'
              value={dashboardData.totalStudents}
              icon='ph:student'
              color='#8884d8'
              subtitle='Active students'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title='Total Lecturers'
              value={dashboardData.totalDosen}
              icon='ph:chalkboard-teacher'
              color='#82ca9d'
              subtitle='Teaching staff'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title='Total Courses'
              value={dashboardData.totalCourses}
              icon='ph:book'
              color='#ffc658'
              subtitle='Available courses'
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title='Total Schedules'
              value={dashboardData.totalSchedules}
              icon='ph:calendar'
              color='#ff7c7c'
              subtitle='Active schedules'
            />
          </Grid>
        </Grid>
      </Can>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Students by Semester */}
        <Can I='read' a='PENDAFTARAN_ASISTEN_LAB'>
          <Grid item xs={12}>
            <ApplicationStatusCard data={dashboardData.assistantApplicationStatus} />
          </Grid>
        </Can>

        <Grid item xs={12}>
          <ScheduleOverview />
        </Grid>

        <Grid item xs={12}>
          <IncomingAbsent />
        </Grid>

        {/* <Can I='read' a='MAHASISWA'>
          <Grid item xs={12} md={6}>
            <PieChartCard title='Students by Semester' data={dashboardData.studentsBySemester} />
          </Grid>
        </Can> */}

        {/* Courses by Bidang Minat */}
        {/* <Can I='read' a='MASTER_DATA'>
          <Grid item xs={12} md={6}>
            <PieChartCard title='Courses by Bidang Minat' data={dashboardData.coursesByBidangMinat} />
          </Grid>
        </Can> */}

        {/* Course Type Distribution */}
        {/* <Can I='read' a='MASTER_DATA'>
          <Grid item xs={12} md={6}>
            <PieChartCard title='Course Type Distribution' data={dashboardData.courseTypeDistribution} />
          </Grid>
        </Can> */}

        {/* Application Status */}

        {/* Monthly Enrollment Trend */}
        {/* <Can I='read' a='MAHASISWA'>
          <Grid item xs={12} md={6}>
            <LineChartCard
              title='Monthly Enrollment Trend'
              data={dashboardData.monthlyEnrollmentTrend}
              dataKey='value'
            />
          </Grid>
        </Can> */}

        {/* Assistant Applications Trend */}
        {/* <Can I='read' a='PENDAFTARAN_ASISTEN_LAB'>
          <Grid item xs={12} md={6}>
            <LineChartCard
              title='Assistant Applications Trend'
              data={dashboardData.assistantApplicationsTrend}
              dataKey='value'
            />
          </Grid>
        </Can> */}

        {/* Weekly Schedule Density */}
        {/* <Can I='read' a='JADWAL'>
          <Grid item xs={12}>
            <BarChartCard title='Weekly Schedule Density' data={dashboardData.weeklyScheduleDensity} height={400} />
          </Grid>
        </Can> */}

        {/* Room Utilization Radar */}
        {/* <Can I='read' a='RUANGAN'>
          <Grid item xs={12} md={6}>
            <RadarChartCard title='Room Utilization' data={dashboardData.roomUtilizationRadar} />
          </Grid>
        </Can> */}

        {/* Course Hierarchy */}
        {/* <Can I='read' a='MASTER_DATA'>
          <Grid item xs={12} md={6}>
            <CourseHierarchyCard title='Course Hierarchy' data={dashboardData.courseHierarchy} />
          </Grid>
        </Can> */}
      </Grid>
    </Box>
  )
}
