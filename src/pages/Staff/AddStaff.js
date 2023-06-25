import React from 'react'
import { Button, FormControl, FormGroup, Grid, InputBase, Typography } from '@mui/material'

const AddStaff = () => {
  return (
    <>
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
      <Grid container spacing={3} sx={{marginTop:'6px'}}>
          <Grid item md={1.5}>
              <Button className='btn btn-tertiary'>Save</Button>
          </Grid>
          <Grid item md={1.5}>
              <Button className='btn btn-secondary'>Cancel</Button>
          </Grid>
      </Grid>
    </>
  )
}

export default AddStaff