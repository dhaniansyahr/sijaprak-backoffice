/* eslint-disable lines-around-comment */
import { Box, Typography } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { generatePastelColor } from 'src/utils'

export default function JadwalCalendar({ events, initialDate }: any) {
  const { settings } = useSettings()
  const { skin } = settings

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        overflowX: { sm: 'auto', md: 'hidden' },
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
      }}
    >
      <Box
        sx={{
          px: 5,
          flexGrow: 1,
          borderRadius: 1,
          minWidth: 700,
          boxShadow: 'none',
          backgroundColor: 'background.paper'
        }}
      >
        {events && (
          <FullCalendar
            initialDate={initialDate}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            headerToolbar={false}
            events={events}
            editable={true}
            droppable={true}
            navLinks={true}
            eventClick={function (params: any) {
              console.log('EVENT CLICK : ', params)
            }}
            eventColor='transparent'
            eventContent={function (arg: any) {
              return (
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'start'}
                  sx={{
                    backgroundColor: generatePastelColor(),
                    padding: '4px',
                    flexDirection: 'column',
                    borderRadius: '3px'
                  }}
                >
                  <Typography variant='body2'>Name: {arg.event.title}</Typography>
                  <Typography variant='body2'>
                    {arg.event.extendedProps.data?.shiftName} {arg.event.extendedProps.data?.shiftTime}
                  </Typography>
                  {arg.event.extendedProps.data?.dosen.length > 0 &&
                    arg.event.extendedProps.data?.dosen?.map((item: any, index: number) => (
                      <Typography variant='body2' key={index}>
                        Dosen {index + 1} : {item?.name}
                      </Typography>
                    ))}
                  {arg.event.extendedProps.data?.asistenLab.length > 0 &&
                    arg.event.extendedProps.data?.asistenLab?.map((item: any, index: number) => (
                      <Typography
                        variant='body2'
                        key={index}
                        sx={{
                          whiteSpace: 'normal',
                          wordBreak: 'break-word'
                        }}
                      >
                        Asisten Lab {index + 1} : {item?.name}
                      </Typography>
                    ))}
                </Box>
              )
            }}
          />
        )}
      </Box>
    </CalendarWrapper>
  )
}
