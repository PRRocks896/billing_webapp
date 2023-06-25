import React from 'react'
import { Box, Button, FormControl, FormGroup, Grid, InputBase, Typography } from '@mui/material'
import { FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const AddStaff = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box className="card">
        {/* top page action with text */}
        <Box className="top-bar">
          <Grid container justifyContent={'end'}>
            <Grid item md={0.7}>
              <Button className='btn-close' onClick={() => navigate(-1)}>
                <FiX size={25} color='var(--color-grey)'/>
              </Button>
            </Grid>
          </Grid>
        </Box>
        <FormGroup className='form-field'>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="standard" className='form-control'>
                    <Typography variant="body2" component="span"
                        className='text-black input-label'>
                        Staff Name *
                    </Typography>
                    <InputBase 
                        name="staff-name"
                        placeholder="Enter staff name"
                        className={'input-field'}
                    />
                </FormControl>
              </Grid>
          </Grid>
        </FormGroup>
      </Box>
      <Grid container spacing={3} sx={{marginTop:'6px'}}>
          <Grid item md={1.5}>
              <Button className='btn btn-tertiary'>Save</Button>
          </Grid>
          <Grid item md={1.5}>
              <Button className='btn btn-cancel'>Cancel</Button>
          </Grid>
      </Grid>
    </>
  )
}

export default AddStaff