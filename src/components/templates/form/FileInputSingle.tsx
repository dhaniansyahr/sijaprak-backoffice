import { Box, Button, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import Icon from 'src/@core/components/icon'
import { checkFileType } from 'src/utils'

interface IFileInputSingle {
  id: string
  value: any
  setValue: (id: string, value: any) => void
  height: number
  width: number
  isLoading: boolean
}

export default function FileInputSingle({ id, value, setValue, width, height, isLoading }: IFileInputSingle) {
  const theme = useTheme()

  const handleAddFile = () => {
    const fileInput = document.getElementById(id) as HTMLInputElement
    fileInput.click()
  }

  const handleChangeFile = (file: any, id: string) => {
    if (file) {
      setValue(id, {
        url: URL.createObjectURL(file),
        file: file,
        type: checkFileType(file?.name)
      })
    }
  }

  const handleRemoveFile = (id: string) => {
    setValue(id, '')
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
      {value?.url ? (
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {value?.type === 'image' ? (
              <Image
                priority
                src={value?.url}
                height='480'
                width='480'
                alt={value?.url}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '12px',
                  objectFit: 'cover'
                }}
              />
            ) : value?.type === 'video' ? (
              <video
                controls
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '12px',
                  objectFit: 'cover'
                }}
              >
                <source src={value?.url} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </Box>
          <Button
            sx={{
              top: -8,
              right: -8,
              p: 1,
              minWidth: 0,
              position: 'absolute',
              background: theme.palette.common.white,
              borderRadius: '50%',
              border: `1px solid ${theme.palette.divider}`
            }}
            onClick={() => handleRemoveFile(id)}
          >
            <Icon icon='mdi:close' fontSize={16} color={theme.palette.divider} />
          </Button>
        </Box>
      ) : (
        <Box>
          <Button
            sx={{
              width: `${width}px`,
              height: `${height}px`,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              outlineStyle: 'dashed'
            }}
            disabled={isLoading}
            onClick={() => handleAddFile()}
          >
            <Box>
              <Icon icon='mdi:plus' color='primary' />
              <Typography variant='subtitle2' color='primary'>
                Upload
              </Typography>
            </Box>
          </Button>
          <input
            type='file'
            id={id}
            accept='image/*, video/*'
            style={{ display: 'none' }}
            onChange={e => handleChangeFile(e.target.files?.[0], id)}
          />
        </Box>
      )}
    </Box>
  )
}
