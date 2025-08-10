import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import DialogAssignAsistenLab from './DialogAssignAsistenLab'
import { IDialogRef } from 'src/components/shared/dialog'
import { useForm, FormProvider } from 'react-hook-form'
import { useAppDispatch } from 'src/utils/dispatch'
import { createJadwal } from 'src/stores/jadwal/action'
import toast from 'react-hot-toast'
import { setIsRefresh } from 'src/stores/jadwal/slice'

import DialogAdd from './DialogAdd'
import DialogUpload from './DialogUpload'
import DialogConfirmation from 'src/components/shared/confirmation-dialog'
import DialogConflict from './DialogConflict'
import DialogEditPertemuan from './DialogEditPertemuan'
import DialogEdit from './DialogEdit'

export interface IDialogsJadwalRef {
  openAddDialog: () => void
  openEditDialog: (id: string) => void
  openAssignAsisten: (id: string) => void
  openEditPertemuan: (id: string) => void
  openBulkUpload: () => void
}

interface IDialogsJadwalProps {
  id: string
  setId: (id: string) => void
  ref?: React.RefObject<IDialogsJadwalRef>
}

export interface ICreateJadwal {
  hari: string
  shiftId: string
  ruanganId: string
  matakuliahId: string
  kelas: string
  isOverride: boolean
}

const DialogJadwals = forwardRef<IDialogsJadwalRef, IDialogsJadwalProps>(({ id, setId }, ref) => {
  const dispatch = useAppDispatch()

  const methods = useForm<ICreateJadwal>({
    defaultValues: {
      hari: '',
      shiftId: '',
      ruanganId: '',
      matakuliahId: '',
      kelas: '',
      isOverride: false
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [conflictData, setConflictData] = useState<any[]>([])

  const dialogAddRef = useRef<IDialogRef>(null)
  const dialogEditRef = useRef<IDialogRef>(null)
  const dialogAsistenRef = useRef<IDialogRef>(null)
  const dialogEditPertemuanRef = useRef<IDialogRef>(null)
  const dialogBulkUploadRef = useRef<IDialogRef>(null)
  const dialogConfirmationRef = useRef<IDialogRef>(null)
  const dialogConflictRef = useRef<IDialogRef>(null)

  useImperativeHandle(ref, () => ({
    openAddDialog: () => {
      dialogAddRef.current?.open()
    },
    openEditDialog: id => {
      setId(id)
      dialogEditRef.current?.open()
    },
    openAssignAsisten: id => {
      setId(id)
      dialogAsistenRef.current?.open()
    },
    openEditPertemuan(id) {
      setId(id)
      dialogEditPertemuanRef.current?.open()
    },
    openBulkUpload: () => {
      dialogBulkUploadRef.current?.open()
    }
  }))

  const onOpenConflictDialog = () => dialogConflictRef.current?.open()

  const onSubmit = methods.handleSubmit(async (data: any) => {
    setIsLoading(true)

    const body = Object.assign({}, data)

    // @ts-ignore
    await dispatch(createJadwal({ data: body })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        if (res.payload?.response?.status === 409 || res.payload?.status === 409) {
          setIsLoading(false)

          const err = res?.payload?.response?.data?.errors
          setConflictData(err)

          onOpenConflictDialog()

          return
        }

        toast.error(res?.payload?.response?.data?.message)

        return
      }

      toast.success(res?.payload?.message)
      setIsLoading(false)
      dispatch(setIsRefresh())
      dialogAddRef.current?.close()
      dialogConfirmationRef?.current?.close()
      dialogConflictRef?.current?.close()
    })
  })

  return (
    <FormProvider {...methods}>
      <DialogAdd dialogRef={dialogAddRef} onSubmit={() => dialogConfirmationRef.current?.open()} />

      <DialogAssignAsistenLab dialogRef={dialogAsistenRef} id={id} />

      <DialogEdit dialogRef={dialogEditRef} id={id} />

      <DialogEditPertemuan dialogRef={dialogEditPertemuanRef} id={id} />

      <DialogUpload dialogRef={dialogBulkUploadRef} />

      <DialogConfirmation dialogRef={dialogConfirmationRef} onConfirm={onSubmit} isLoading={isLoading} />

      <DialogConflict
        dialogRef={dialogConflictRef}
        onSubmit={() => {
          methods.setValue('isOverride', true)
          onSubmit()
        }}
        isLoading={isLoading}
        errors={conflictData}
      />
    </FormProvider>
  )
})

export default DialogJadwals
