import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import React from 'react'
import { FiChevronRight, FiFileText, FiLogOut, FiGrid, FiSquare } from 'react-icons/fi';
import {GoHome} from 'react-icons/go'
import { IoReceiptOutline } from "react-icons/io5";
import { FaRegUser } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";


const Sidebar = () => {

    const navigate=useNavigate()
  
    // sidebar menu accordion
    const [expanded, setExpanded] = React.useState(false);
      
    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      {/* sidebar menu */}
      <Box className='sidebar-menu'> 
        <div>
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className='menu-list' onClick={()=>navigate("/")}>
              <AccordionSummary className='menu-title'
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              >
                  <Typography>
                      <GoHome/>  Home
                  </Typography>
              </AccordionSummary>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} className='menu-list'>
              <AccordionSummary className='menu-title'
              expandIcon={<FiChevronRight />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
              >
                  <Typography>
                    <FiGrid/>  Master
                  </Typography>                            
              </AccordionSummary>
              <AccordionDetails className='sub-menu-list'>
                  <Box className='sub-menu-link active'>
                      <Typography><FiSquare/> Customer</Typography>
                  </Box>
                  <Box className='sub-menu-link'>
                      <Typography><FiSquare/> Staff</Typography>
                  </Box>
                  <Box className='sub-menu-link'>
                      <Typography><FiSquare/> Service Category</Typography>
                  </Box>
                  <Box className='sub-menu-link'>
                      <Typography><FiSquare/> Service</Typography>
                  </Box>
                  <Box className='sub-menu-link'>
                      <Typography><FiSquare/> Payment Type</Typography>
                  </Box>
              </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} className='menu-list'>
              <AccordionSummary className='menu-title'
              aria-controls="panel3bh-content"
              id="panel3bh-header">
                  <Typography>
                      <IoReceiptOutline/>  Bill
                  </Typography>                            
              </AccordionSummary>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} className='menu-list'>
              <AccordionSummary className='menu-title'
              aria-controls="panel4bh-content"
              id="panel4bh-header"
              >
                  <Typography>
                      <FiFileText/> Reports
                  </Typography>
              </AccordionSummary>
          </Accordion>
          <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} className='menu-list'>
              <AccordionSummary className='menu-title'
              aria-controls="panel5bh-content"
              id="panel5bh-header"
              >
                  <Typography>
                      <FaRegUser/> User
                  </Typography>
              </AccordionSummary>
          </Accordion>
        </div> 
        <div>
          <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')} className='menu-list'>
              <AccordionSummary className='menu-title logout-title'
              aria-controls="panel5bh-content"
              id="panel5bh-header"
              >
                  <Typography>
                      <FiLogOut/> Logout
                  </Typography>
              </AccordionSummary>
          </Accordion>
        </div>
      </Box>
    </>
  )
}

export default Sidebar
