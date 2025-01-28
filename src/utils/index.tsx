export const formatMoney = (amount: number, currency = 'IDR') => {
  return amount.toLocaleString('id-ID', {
    style: 'currency',
    currency: currency
  })
}

export const checkFileType = (file: string) => {
  const extension = file?.split('.').pop()?.toLowerCase()
  let fileType = null

  if (
    extension === 'jpg' ||
    extension === 'jpeg' ||
    extension === 'png' ||
    extension === 'gif' ||
    extension === 'bmp' ||
    extension === 'webp' ||
    extension === 'svg'
  ) {
    fileType = 'image'
  } else if (
    extension === 'mp4' ||
    extension === 'webm' ||
    extension === 'ogg' ||
    extension === 'avi' ||
    extension === 'mpeg' ||
    extension === 'mov' ||
    extension === 'flv'
  ) {
    fileType = 'video'
  } else {
    fileType = 'other'
  }

  return fileType
}
