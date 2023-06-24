import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import React from 'react'
import { FiChevronRight, FiClock, FiFileText, FiFolderPlus, FiGrid, FiSquare, FiUser } from 'react-icons/fi';
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
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className='menu-list' onClick={()=>navigate("/")}>
              <AccordionSummary className='menu-title'
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              >
                  <Typography>
                      <FiGrid/>  Dashboard
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
                    <FiClock/>  Timesheets
                  </Typography>                            
              </AccordionSummary>
              <AccordionDetails className='sub-menu-list'>
                  <Box className='sub-menu-link active' onClick={()=>navigate("/screenshots")}>
                      <Typography>
                          <FiSquare/> Screenshots
                      </Typography>
                  </Box>
                  <Box className='sub-menu-link' onClick={()=>navigate("/timesheet-view-edit")}>
                      <Typography>
                          <FiSquare/> View & Edit
                      </Typography>
                  </Box>
              </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} className='menu-list'>
              <AccordionSummary className='menu-title'
              expandIcon={<FiChevronRight />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
              >
                  <Typography>
                      <FiFolderPlus/>   Project Managements
                  </Typography>                            
              </AccordionSummary>
              <AccordionDetails className='sub-menu-list'>
                  <Box className='sub-menu-link active' onClick={()=>navigate("/projects")}>
                      <Typography>
                          <FiSquare/> Projects
                      </Typography>
                  </Box>
                  <Box className='sub-menu-link'  onClick={()=>navigate("/to-dos")}>
                      <Typography>
                          <FiSquare/> To Dos
                      </Typography>
                  </Box>
              </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} className='menu-list'  onClick={()=>navigate("/reports")}>
              <AccordionSummary className='menu-title'
              aria-controls="panel4bh-content"
              id="panel4bh-header"
              >
                  <Typography>
                      <FiFileText/> Reports
                  </Typography>
              </AccordionSummary>
          </Accordion>
          <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} className='menu-list'  onClick={()=>navigate("/employees")}>
              <AccordionSummary className='menu-title'
              aria-controls="panel5bh-content"
              id="panel5bh-header"
              >
                  <Typography>
                      <FiUser/> Employees
                  </Typography>
              </AccordionSummary>
          </Accordion>
      </Box>
    </>
  )
}

export default Sidebar
