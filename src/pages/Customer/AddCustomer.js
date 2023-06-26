import React, { useState } from 'react'
import { Box, Button, FormControl, FormGroup, Grid, InputBase, Radio, Typography } from '@mui/material'
import { FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'


// const closeButtonStyle = {
//   borderRadius: 6,
//   padding: '10px 5px',
//   cursor: 'pointer',
//   backgroundColor: 'rgba(25, 118, 210, 0.04)'
// }


const AddCustomer = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("active");

  const changeStatusHandler = (status) => {
    setStatus(status);
  }

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
              <Grid item xs={6}>
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
              <Grid item xs={6}>
                <FormControl variant="standard" className='form-control'>
                    <Typography variant="body2" component="span" className='text-black input-label'>
                    Phone *
                    </Typography>
                    <InputBase 
                        name="phone"
                        type='number'
                        placeholder="Phone"
                        className={'input-field'}
                    />
                </FormControl>
              </Grid>
              {/*  */}
              <Grid item xs={6}>
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

              <Grid item xs={6}>
                <FormControl variant="standard" className='form-control'>
                  <Typography variant="body2" component="span" className='text-black input-label'>
                    Status *
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Box className="mask-box">
                        <Box
                          className="mask"
                          style={{
                            transform: `translateX(${status === "active" ? 0 : "100px"})`
                          }}
                        />
                        <Button
                          disableRipple
                          variant="text"
                          onClick={() => changeStatusHandler('active')}
                          sx={{ color:status === "active" ? "#ffffff" : "var(--color-black)"  }}
                        >
                          Active
                        </Button>
                        <Button
                          disableRipple
                          variant="text"
                          onClick={() => changeStatusHandler('inactive')}
                          sx={{ color: status === "inactive" ? "#ffffff" : "var(--color-black)" }}
                        >
                          Inactive
                        </Button>
                    </Box>
                  </Box>
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

export default AddCustomer