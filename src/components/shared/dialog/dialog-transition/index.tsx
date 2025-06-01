import { Fade, FadeProps } from '@mui/material'
import { forwardRef, ReactElement, Ref } from 'react'

const TransitionDialog = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

export default TransitionDialog
