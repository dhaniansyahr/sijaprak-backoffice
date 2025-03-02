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

export function generatePastelColor(): string {
  // Use golden ratio for better distribution
  const goldenRatio = 0.618033988749895
  const index = Math.random()
  const hue = (index * goldenRatio) % 1

  // Fixed saturation and lightness for consistent pastel effect
  const saturation = 0.35 // 35%
  const lightness = 0.9 // 90%

  const h = hue * 6
  const s = saturation
  const l = lightness

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h % 2) - 1))
  const m = l - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (h < 1) {
    r = c
    g = x
  } else if (h < 2) {
    r = x
    g = c
  } else if (h < 3) {
    g = c
    b = x
  } else if (h < 4) {
    g = x
    b = c
  } else if (h < 5) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  // Convert to hex
  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)

    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
