'use client'
import Box from '@mui/material/Box'

export default function TabPanel({ children, value, index }: any) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}
