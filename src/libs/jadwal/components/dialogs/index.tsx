import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import DialogAssignAsistenLab from './DialogAssignAsistenLab'
import { IDialogRef } from 'src/components/shared/dialog'
import { useForm, FormProvider } from 'react-hook-form'
import { useAppDispatch } from 'src/utils/dispatch'
import { check, createJadwal, updateJadwal } from 'src/stores/jadwal/action'
import toast from 'react-hot-toast'
import { setIsRefresh } from 'src/stores/jadwal/slice'

import DialogAdd from './DialogAdd'
import DialogUpload from './DialogUpload'
import DialogConfirmation from 'src/components/shared/confirmation-dialog'
import DialogConflict from './DialogConflict'
import DialogEditPertemuan from './DialogEditPertemuan'
import DialogEdit from './DialogEdit'
import DialogCreateOptions from './DialogCreateOptions'

export interface IDialogsJadwalRef {
  openOptionsDialog: () => void
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
export interface IUpdateJadwal {
  hari: string
  shiftId: string
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

  const methodsEdit = useForm<IUpdateJadwal>({
    defaultValues: {
      hari: '',
      shiftId: '',
      isOverride: false
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [conflictData, setConflictData] = useState<any[]>([])

  const dialogOptionsRef = useRef<IDialogRef>(null)
  const dialogAddRef = useRef<IDialogRef>(null)
  const dialogEditRef = useRef<IDialogRef>(null)
  const dialogAsistenRef = useRef<IDialogRef>(null)
  const dialogEditPertemuanRef = useRef<IDialogRef>(null)
  const dialogBulkUploadRef = useRef<IDialogRef>(null)
  const dialogConfirmationRef = useRef<IDialogRef>(null)
  const dialogConflictRef = useRef<IDialogRef>(null)

  useImperativeHandle(ref, () => ({
    openOptionsDialog: () => {
      dialogOptionsRef.current?.open()
    },

    openEditDialog: id => {
      setId(id)
      methodsEdit.reset({
        hari: '',
        shiftId: '',
        isOverride: false
      })
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
        setIsLoading(false)

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

  const onSubmitEdit = methodsEdit.handleSubmit(async (data: any) => {
    setIsLoading(true)

    const body = Object.assign({}, data)

    // @ts-ignore
    await dispatch(updateJadwal({ data: body, id })).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        if (res.payload?.response?.status === 409 || res.payload?.status === 409) {
          setIsLoading(false)

          const err = res?.payload?.response?.data?.errors
          setConflictData(err)

          onOpenConflictDialog()

          return
        }

        toast.error(res?.payload?.response?.data?.message)
        setIsLoading(false)

        return
      }

      toast.success(res?.payload?.message)
      setIsLoading(false)
      dispatch(setIsRefresh())
      dialogEditRef.current?.close()
      dialogConflictRef?.current?.close()
    })
  })

  const onCheckTheoryJadwal = async () => {
    setIsLoading(true)

    // @ts-ignore
    await dispatch(check()).then(res => {
      if (res.meta.requestStatus !== 'fulfilled') {
        toast.error(res.payload?.response?.data?.message)

        setIsLoading(false)

        return
      }

      if (res.payload?.content) {
        console.log('response : ', res?.payload?.content)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        dialogBulkUploadRef.current?.open()
      }
    })
  }

  return (
    <>
      <DialogCreateOptions
        dialogRef={dialogOptionsRef}
        onManual={() => dialogAddRef.current?.open()}
        onGenerate={() => onCheckTheoryJadwal()}
      />
      <FormProvider {...methods}>
        <DialogAdd dialogRef={dialogAddRef} onSubmit={() => dialogConfirmationRef.current?.open()} />
        <DialogConfirmation dialogRef={dialogConfirmationRef} onConfirm={onSubmit} isLoading={isLoading} />
      </FormProvider>

      <FormProvider {...methodsEdit}>
        <DialogEdit dialogRef={dialogEditRef} id={id} onSubmit={onSubmitEdit} isLoading={isLoading} />
      </FormProvider>

      <DialogAssignAsistenLab dialogRef={dialogAsistenRef} id={id} />

      <DialogEditPertemuan dialogRef={dialogEditPertemuanRef} id={id} />

      <DialogUpload dialogRef={dialogBulkUploadRef} />

      <DialogConflict
        dialogRef={dialogConflictRef}
        onSubmit={() => {
          if (dialogAddRef.current?.isOpen) {
            methods.setValue('isOverride', true)
            onSubmit()
          } else {
            methodsEdit.setValue('isOverride', true)
            onSubmitEdit()
          }
        }}
        isLoading={isLoading}
        errors={conflictData}
      />
    </>
  )
})

export default DialogJadwals
