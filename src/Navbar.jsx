import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeModeSelector from "./ThemeModeSelector";

export default function ResponsiveAppBar() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    let navigate = useNavigate();

    const settings = ['Home'];
  
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const handleNavigationButtonClick = (_setting) => {
        if(_setting == 'Home'){
            navigate("/");
        }
    }
  
    return (
      <AppBar position="static" color="transparent" elevation={0}>
        <Container maxWidth="xl" sx={{display:"flex", maxHeight:20, mt:3, alignItems:"center"}}>

  
            <Box sx={{ flexGrow: 0, marginLeft:"auto"}}>
              <Tooltip title="Open settings">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleNavigationButtonClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
                <Box sx={{width:"100%", display:"flex", justifyContent:"center"}}>
                  <ThemeModeSelector/>

                </Box>
              </Menu>
            </Box>
        </Container>
      </AppBar>
    );
  }

