// Lightweight custom icons to replace @iconify/react
// This reduces bundle size by ~200KB

import { memo } from 'react'

interface IconProps {
  width?: number
  height?: number
  color?: string
  className?: string
}

export const EyeIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' />
  </svg>
))

export const EditIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
  </svg>
))

export const AddIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
  </svg>
))

export const ChangeIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
  </svg>
))

export const DeleteIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
  </svg>
))

export const SearchIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' />
  </svg>
))

export const MenuIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' />
  </svg>
))

export const CloseIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
  </svg>
))

export const SaveIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z' />
  </svg>
))

export const CancelIcon = memo(({ width = 16, height = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={width} height={height} viewBox='0 0 24 24' fill={color} className={className}>
    <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z' />
  </svg>
))

// Display names for better debugging
EyeIcon.displayName = 'EyeIcon'
EditIcon.displayName = 'EditIcon'
AddIcon.displayName = 'AddIcon'
ChangeIcon.displayName = 'ChangeIcon'
DeleteIcon.displayName = 'DeleteIcon'
SearchIcon.displayName = 'SearchIcon'
MenuIcon.displayName = 'MenuIcon'
CloseIcon.displayName = 'CloseIcon'
SaveIcon.displayName = 'SaveIcon'
CancelIcon.displayName = 'CancelIcon'
