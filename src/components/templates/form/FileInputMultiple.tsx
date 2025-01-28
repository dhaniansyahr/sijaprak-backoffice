import { Box, Button, Typography, useTheme } from '@mui/material'
import Image from 'next/image'
import Icon from 'src/@core/components/icon'
import { checkFileType } from 'src/utils'

interface IFileInputMultiple {
  id: string
  max?: number
  values: any
  setValues: (values: any[]) => void
  height: number
  width: number
  isLoading: boolean
}

export default function FileInputMultiple({
  id,
  max,
  values,
  setValues,
  width,
  height,
  isLoading
}: IFileInputMultiple) {
  const theme = useTheme()

  const handleAddFile = () => {
    const fileInput = document.getElementById(id) as HTMLInputElement
    fileInput.click()
  }

  const handleChangeFile = (files: any) => {
    if (files) {
      const newFiles: any[] = Array.from(files).map((file: any) => ({
        url: URL.createObjectURL(file),
        file: file,
        type: checkFileType(file?.name)
      }))

      setValues([...values, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...values]
    newFiles.splice(index, 1)
    setValues(newFiles)
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
      {values?.map((file: any, index: number) => {
        return (
          <Box sx={{ position: 'relative' }} key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {file?.type === 'image' ? (
                <Image
                  priority
                  src={file?.url}
                  height='480'
                  width='480'
                  alt='Image'
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '12px',
                    objectFit: 'cover'
                  }}
                />
              ) : file?.type === 'video' ? (
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
                  <source src={file?.url} type='video/mp4' />
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
              onClick={() => handleRemoveFile(index)}
            >
              <Icon icon='mdi:close' fontSize={16} color={theme.palette.divider} />
            </Button>
          </Box>
        )
      })}
      {values?.length < (max !== undefined ? max : 999) && (
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
            accept='image/*, video/*'
            id={id}
            style={{ display: 'none' }}
            onChange={e => handleChangeFile(e.target.files)}
          />
        </Box>
      )}
    </Box>
  )
}
