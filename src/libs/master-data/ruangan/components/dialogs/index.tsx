import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { IDialogRef } from 'src/components/shared/dialog'
import DialogAdd from './DialogAdd'
import DialogEdit from './DialogEdit'
import DialogChange from './DialogChange'
import DialogDetail from './DialogDetail'

export interface IDialogsRuanganRef {
  openDialogAdd: () => void
  openDialogEdit: (values: any) => void
  openDialogChange: (values: any) => void
  openDialogDetail: (values: string) => void
}

interface IDialogRuanganProps {
  values: any
  setValues: (values: any) => void
  ref?: React.RefObject<IDialogsRuanganRef>
}

const DialogsRuangan = forwardRef<IDialogsRuanganRef, IDialogRuanganProps>(({ values, setValues }, ref) => {
  const dialogAddRef = useRef<IDialogRef>(null)
  const dialogEditRef = useRef<IDialogRef>(null)
  const dialogDetailRef = useRef<IDialogRef>(null)
  const dialogChangeRef = useRef<IDialogRef>(null)

  useImperativeHandle(ref, () => ({
    openDialogAdd: () => {
      dialogAddRef.current?.open()
    },
    openDialogEdit: values => {
      setValues(values)
      dialogEditRef.current?.open()
    },
    openDialogDetail: values => {
      setValues(values)
      dialogEditRef.current?.open()
    },
    openDialogChange: values => {
      setValues(values)
      dialogEditRef.current?.open()
    }
  }))

  return (
    <>
      <DialogAdd dialogRef={dialogAddRef} />

      <DialogEdit dialogRef={dialogEditRef} values={values} />

      <DialogChange dialogRef={dialogChangeRef} values={values} />

      <DialogDetail dialogRef={dialogDetailRef} id={values?.id} />
    </>
  )
})

export default DialogsRuangan
