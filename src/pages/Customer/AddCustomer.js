import { Button, FormControl, FormGroup, Grid, InputBase, Radio, TextField, Typography } from '@mui/material'
import React from 'react'

const AddCustomer = () => {
  return (
    <>
      <FormGroup className='form-field'>
        <Grid container spacing={2}>
            <Grid item xs={12}>
            <FormControl variant="standard" className='form-control'>
                <Typography variant="body2" component="span"
                    className='text-black input-label'>
                    Customer Name *
                </Typography>
                <InputBase 
                    name="name"
                    placeholder="Enter customer name"
                    className={'input-field'}
                />
            </FormControl>
            </Grid>
            {/*  */}
            <Grid item xs={12}>
            <FormControl variant="standard" className='form-control'>
                <Typography variant="body2" component="span" className='text-black input-label'>
                Phone *
                </Typography>
                <InputBase 
                    name="phone"
                    placeholder="Phone"
                    className={'input-field'}
                />
            </FormControl>
            </Grid>
            {/*  */}
            <Grid item xs={12}>
              <FormControl variant="standard" className='form-control'>
                  <Typography variant="body2" component="span" className='text-black input-label'>
                  Gender *
                  </Typography>
                  <Grid container alignItems={'center'} gap={5}>
                    <span>
                      <Radio
                        checked={true}
                        value="male"
                        name="radio-buttons"
                        className='radio-field'
                        slotProps={{ input: { 'aria-label': 'A' } }}
                      /> Male
                    </span>
                    <span>
                      <Radio
                        checked={false}
                        value="male"
                        name="radio-buttons"
                        className='radio-field'
                        slotProps={{ input: { 'aria-label': 'A' } }}
                      /> Female
                    </span>
                  </Grid>
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

export default AddCustomer