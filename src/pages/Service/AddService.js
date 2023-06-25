import React from 'react'
import { Button, FormControl, FormGroup, Grid, InputBase, Typography } from '@mui/material'
import Select from 'react-select';

// select option
const options = [
  { value: 'Category1', label: 'Category 1' },
  { value: 'Category2', label: 'Category 2' },
  { value: 'Category3', label: 'Category 3' },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: `1px solid ${(state.isFocused || state.hover)  ? 'var(--color-black)' : 'var(--color-grey)'}`,
    borderRadius: 6,
    padding: '7px 0px',
  }),
};


const AddService = () => {
  return (
    <>
      <FormGroup className='form-field'>
        <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl variant="standard" className='form-control'>
                  <Typography variant="body2" component="span"
                      className='text-black input-label'>
                      Service Name *
                  </Typography>
                  <InputBase 
                      name="service-name"
                      placeholder="Enter service name"
                      className={'input-field'}
                  />
              </FormControl>
            </Grid>
            {/*  */}
            <Grid item xs={6}>
              <FormControl variant="standard" className='form-control'>
                  <Typography variant="body2" component="span" className='text-black input-label'>
                  Amount *
                  </Typography>
                  <InputBase 
                      name="amount"
                      placeholder="Amount"
                      className={'input-field'}
                  />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" className='form-control'>
                <Typography variant="body2" component="span" className='text-black input-label'>
                    Select Category *
                </Typography>
                <Select
                  placeholder="Select category" 
                  options={options}
                  styles={customStyles}
                  theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: '#364865',
                      },
                    })
                  }
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

export default AddService