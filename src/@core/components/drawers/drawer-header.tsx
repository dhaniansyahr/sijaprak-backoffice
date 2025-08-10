import { Box, useTheme } from '@mui/material';

export default function DrawerHeader({ children }: any) {
    const { palette } = useTheme();

    return (
        <Box className='drawer-header' display={'flex'} width={'100%'} justifyContent={'space-between'} gap={'8px'} padding={'16px '} alignItems={'start'}
            bgcolor={'#39404B'}
        >
            {children}
        </Box>
    )
}
