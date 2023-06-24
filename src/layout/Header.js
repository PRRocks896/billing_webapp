import React from 'react';

import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { IconButton, Box, Drawer, Typography, Divider, Toolbar, Tooltip, Avatar, Menu, MenuItem, ListItemIcon} from '@mui/material';
import { FiChevronRight, FiChevronLeft, FiUser, FiLogOut} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SiteLogo from '../assets/images/logo.png';
import ProfileImage from '../assets/images/avatar2.jpg';
import Sidebar from './Sidebar';

const drawerWidth = 300;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Header = ({handleDrawerOpen,handleDrawerClose,open}) => {
     // account dropdown
     const [anchorEl, setAnchorEl] = React.useState(null);
     const openAccount = Boolean(anchorEl);
     const handleClick = (event) => {
       setAnchorEl(event.currentTarget);
     };
     const handleClose = () => {
       setAnchorEl(null);
     };
     
    // sidebar
    const theme = useTheme();

    return (
        <>
            <AppBar position="fixed" open={open} className='header'>
                <Toolbar className='toolbar'>
                    <IconButton className='arrow-btn'
                        aria-label="open drawer"
                        onClick={open ? handleDrawerClose : handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        {open ? <FiChevronLeft /> : <FiChevronRight />}
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" className='page-title'>
                        Page Title
                    </Typography>

                    <Box className='account-dropdown'>
                        <Tooltip title="Profile Setting">
                        <IconButton
                            onClick={handleClick}
                            aria-controls={openAccount ? "account-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={openAccount ? "true" : undefined}
                        >
                            <Avatar className='avatar'>
                                <img src={ProfileImage} alt='account img'/>
                            </Avatar>
                        </IconButton>
                        </Tooltip>
                    </Box>
                    <Menu className='account-dropdown-menu'
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={openAccount}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: "visible",
                                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                                mt: 1.5,
                                "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1
                                },
                                "&:before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: "background.paper",
                                    transform: "translateY(-50%) rotate(45deg)",
                                    zIndex: 0
                                }
                            }
                        }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                        {/* <MenuItem onClick={handleClose}> */}
                        
                        {/* </MenuItem> */}
                        {/* <MenuItem onClick={handleClose}> */}
                        
                        <Box className='user-details'>
                            <Box className='user-img'>
                                <img src={ProfileImage} alt='account img'/>
                            </Box>
                            <Typography variant="span" component="span" className='text-grey user-position' align='center'>
                                Admin
                            </Typography>
                            <Typography variant="h5" component="h5" className='text-green user-name' align='center'>
                                Mr. Nick Johnson
                            </Typography>
                        </Box>
                        <Box className='links'>
                            <Divider/>
                            <MenuItem className='menu-link'>
                                <ListItemIcon className='link-icon'>
                                    <FiUser/>
                                </ListItemIcon>
                                Profile
                            </MenuItem>
                            <MenuItem className='menu-link'>
                                <ListItemIcon className='link-icon'>
                                    <FiLogOut/>
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Box>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer className='sidebar' sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', }, }} variant="persistent" anchor="left" open={open} >
                <DrawerHeader className='site-logo'>
                    <img src={SiteLogo} alt='Sitelogo' width={218} height={140}/>
                    {/* <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <FiChevronLeft /> : <FiChevronRight />}
                    </IconButton> */}
                </DrawerHeader>
                {/* <Divider /> */}
                    
                <Sidebar/>
                
                
            </Drawer>
        </>
    );
}

export default Header;
   