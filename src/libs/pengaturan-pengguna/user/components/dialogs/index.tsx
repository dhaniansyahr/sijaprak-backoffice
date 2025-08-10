import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { IDialogRef } from 'src/components/shared/dialog'
import { deleteRuanganLaboratorium } from 'src/stores/master-data/ruangan/action'
import { setIsRefresh } from 'src/stores/role/slice'
import { useAppDispatch } from 'src/utils/dispatch'
import DialogAdd from './DialogAdd'
import DialogEdit from './DialogEdit'
import DialogConfirmation from 'src/components/shared/confirmation-dialog'

export interface IDialogsUserRef {
  openDialogAdd: () => void
  openDialogEdit: (values: any) => void
  openDialogDelete: (values: any) => void
}

interface IDialogsUserProps {
  values: any
  setValues: (v: any) => void
  ref?: React.RefObject<IDialogsUserRef>
}

const DialogsUser = forwardRef<IDialogsUserRef, IDialogsUserProps>(({ values, setValues }, ref) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)

  const dialogAddRef = useRef<IDialogRef>(null)
  const dialogEditRef = useRef<IDialogRef>(null)
  const dialogDeleteRef = useRef<IDialogRef>(null)

  useImperativeHandle(ref, () => ({
    openDialogAdd: () => {
      dialogAddRef.current?.open()
    },
    openDialogDelete: values => {
      setValues(values)
      dialogDeleteRef.current?.open()
    },
    openDialogEdit: values => {
      setValues(values)
      dialogEditRef.current?.open()
    }
  }))

  const onDelete = async () => {
    setIsLoading(true)

    const body: any = {
      params: {
        ids: JSON.stringify([values?.id])
      }
    }

    // @ts-ignore
    await dispatch(deleteRuanganLaboratorium({ data: body }))
      .then(res => {
        if (res.meta.requestStatus !== 'fulfilled') {
          toast.error(res?.payload?.response?.data?.message)

          return
        }

        toast.success(res?.payload?.message)
        dispatch(setIsRefresh())
        dialogDeleteRef.current?.close()
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <>
      <DialogAdd dialogRef={dialogAddRef} />

      <DialogEdit dialogRef={dialogAddRef} values={values} />

      <DialogConfirmation
        dialogRef={dialogDeleteRef}
        title='Apakah Anda yakin ingin menghapus user ini?'
        message='Menghapus user ini bersifat permanen dan tidak dapat dibatalkan'
        onConfirm={onDelete}
        isLoading={isLoading}
      />
    </>
  )
})
