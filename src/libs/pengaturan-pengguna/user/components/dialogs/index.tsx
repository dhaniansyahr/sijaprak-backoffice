import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { IDialogRef } from 'src/components/shared/dialog'
import { setIsRefresh } from 'src/stores/role/slice'
import { useAppDispatch } from 'src/utils/dispatch'
import DialogAdd from './DialogAdd'
import DialogEdit from './DialogEdit'
import DialogConfirmation from 'src/components/shared/confirmation-dialog'
import { deleteUser } from 'src/stores/users/action'

export interface IDialogsUserRef {
  openDialogAdd: () => void
  openDialogEdit: (id: string) => void
  openDialogDelete: (id: string) => void
}

interface IDialogsUserProps {
  id: string
  setId: (v: string) => void
  ref?: React.RefObject<IDialogsUserRef>
}

const DialogsUser = forwardRef<IDialogsUserRef, IDialogsUserProps>(({ id, setId }, ref) => {
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = useState(false)

  const dialogAddRef = useRef<IDialogRef>(null)
  const dialogEditRef = useRef<IDialogRef>(null)
  const dialogDeleteRef = useRef<IDialogRef>(null)

  useImperativeHandle(ref, () => ({
    openDialogAdd: () => {
      dialogAddRef.current?.open()
    },
    openDialogDelete: id => {
      setId(id)
      dialogDeleteRef.current?.open()
    },
    openDialogEdit: id => {
      setId(id)
      dialogEditRef.current?.open()
    }
  }))

  const onDelete = async () => {
    setIsLoading(true)

    const body: any = {
      params: {
        ids: JSON.stringify([id])
      }
    }

    // @ts-ignore
    await dispatch(deleteUser({ data: body }))
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

      <DialogEdit dialogRef={dialogEditRef} id={id} />

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

export default DialogsUser
