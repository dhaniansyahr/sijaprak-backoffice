import { Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Tab, Tabs, Typography } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'

import moment from 'moment'
import JadwalCalendar from '../components/calendar/JadwalCalendar'
import JadwalTable from '../components/tables/JadwalTable'
import { Icon } from '@iconify/react'
import { NextRouter, useRouter } from 'next/router'

const eventsData = [
  {
    id: 1,
    title: 'Praktikum 1',
    date: '2025-01-27',
    data: {
      shiftName: 'Sesi 1',
      shiftTime: '08:00 - 09:40',
      dosen: [
        {
          name: 'Dosen 1',
          nip: '098765432'
        }
      ],
      asistenLab: [
        {
          name: 'Asisten Lab 1',
          npm: '098765334567'
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Praktikum 2',
    date: '2025-01-28',
    data: {
      shiftName: 'Sesi 2',
      shiftTime: '10:00 - 11:40',
      dosen: [
        {
          name: 'Dosen 2',
          nip: '123456789'
        }
      ],
      asistenLab: [
        {
          name: 'Asisten Lab 2',
          npm: '123456334567'
        }
      ]
    }
  },
  {
    id: 3,
    title: 'Praktikum 3',
    date: '2025-01-29',
    data: {
      shiftName: 'Sesi 3',
      shiftTime: '13:00 - 14:40',
      dosen: [
        {
          name: 'Dosen 3',
          nip: '234567890'
        },
        {
          name: 'Dosen 3',
          nip: '234567890'
        }
      ],
      asistenLab: [
        {
          name: 'Asisten Lab 3',
          npm: '234567334567'
        }
      ]
    }
  },
  {
    id: 4,
    title: 'Praktikum 4',
    date: '2025-01-30',
    data: {
      shiftName: 'Sesi 4',
      shiftTime: '15:00 - 16:40',
      dosen: [
        {
          name: 'Dosen 4',
          nip: '345678901'
        }
      ],
      asistenLab: [
        {
          name: 'Asisten Lab 4',
          npm: '345678334567'
        }
      ]
    }
  },
  {
    id: 5,
    title: 'Praktikum 5',
    date: '2025-01-31',
    data: {
      shiftName: 'Sesi 5',
      shiftTime: '17:00 - 18:40',
      dosen: [
        {
          name: 'Dosen 5',
          nip: '456789012'
        }
      ],
      asistenLab: [
        {
          name: 'Asisten Lab 5',
          npm: '456789334567'
        }
      ]
    }
  },
  {
    id: 6,
    title: 'Praktikum 6',
    date: '2025-01-31',
    data: {
      shiftName: 'Sesi 5',
      shiftTime: '17:00 - 18:40',
      dosen: [
        {
          name: 'Dosen 5',
          nip: '456789012'
        }
      ],
      asistenLab: [
        {
          name: 'Asisten Lab 5',
          npm: '456789334567'
        }
      ]
    }
  }
]

export default function MainJadwalContainer() {
  const router: NextRouter = useRouter()

  const [tabs, setTabs] = useState<string>('CALENDAR')
  const [events, setEvents] = useState<any>(null)

  useEffect(() => {
    setEvents(eventsData)
  }, [])

  return (
    <Fragment>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box>
              <Typography variant='h6' fontWeight={500}>
                Jadwal Praktikum
              </Typography>
            </Box>
          }
          action={
            <Tabs value={tabs} onChange={(e, v) => setTabs(v)}>
              <Tab label='Calendar' value='CALENDAR' />
              <Tab label='Table' value='TABLE' />
            </Tabs>
          }
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'start', md: 'center' },
            borderBottom: '1px solid #f4f4f4'
          }}
        />
      </Card>

      <Card>
        <CardHeader
          title={
            tabs === 'CALENDAR' && (
              <Box display={'flex'} gap={2} alignItems={'center'}>
                <IconButton
                  sx={{
                    transform: 'translateX(-5px)',
                    transition: 'transform 0.3s'
                  }}
                >
                  <Icon icon='ri:arrow-left-s-line' />
                </IconButton>
                <Typography variant='h6' sx={{ fontWeight: 'medium' }}>
                  {moment('01/2025', 'MM/YYYY').format('MMMM ')}
                </Typography>
                <IconButton>
                  <Icon icon='ri:arrow-right-s-line' />
                </IconButton>
              </Box>
            )
          }
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'start', md: 'center' }
          }}
          action={
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant='contained'
                color='primary'
                sx={{ mb: 2 }}
                startIcon={<Icon icon='ic:baseline-add' />}
                onClick={() => router.push('/jadwal/create')}
              >
                Tambah Jadwal
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              {tabs === 'CALENDAR' ? (
                <JadwalCalendar events={events} intialDate={moment('01/2025', 'MM/YYYY').toDate()} />
              ) : (
                <JadwalTable events={events} />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fragment>
  )
}
