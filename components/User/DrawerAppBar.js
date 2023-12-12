import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useUser } from '@auth0/nextjs-auth0/client';

const drawerWidth = 240;
const navItems = [
  { label: 'My Info', path: '/profile' },
  { label: 'Orders', path: '/orders' },
  { label: 'Wishlist', path: '/wishlist' },
  { label: 'Cart', path: '/cart' },
  { label: 'Reviews', path: '/reviews' },
];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const { user } = useUser();
console.log('user', user)
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
//MOBILE 
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Hi, {user.given_name} {user.family_name}!
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center', paddingLeft:'30px' }}>
              <Link href={item.path} passHref>
                {item.label}
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
        <Link href={`/`}>
          <Button
            variant="contained"
            style={{
              backgroundColor: '#1E2E2D', // Background color
              color: 'white', // Text color
              transition: 'background-color 0.3s',
              // marginTop: '1rem',
              '&:hover': {
                backgroundColor: '#32434e',
                width: '200px',
                color: 'white',
              },
            }}
          >
            Continue shopping
          </Button>
        </Link>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{
      display: 'flex', 
      position: 'sticky',
      zIndex: "1000",
      top: ['4.25em', '4.25em','7.3em', '8.2em'], }}>
      {/* <CssBaseline /> */}
      <AppBar component="nav" sx={{
        position: 'sticky',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#324E4B',
        width:'100%',
        

}}>
        <Toolbar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* DESKTOP */}
          <Typography
             variant="h7"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block', 
            // fontSize: ['1rem',  '1rem'], 
          } }}
          >
            Hi, {user.given_name} {user.family_name}!
          </Typography>
       
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Link href={`/`} className='text-[10px] md:text-[13px]' >
              <Button
                // variant="contained"
                sx={{
                  backgroundColor: '#1E2E2D', 
                  color: 'white', // Text color
                  transition: 'background-color 0.3s',
                  fontSize: ['0.5rem', '0.6rem', '0.9rem'],

                  '&:hover': {
                    backgroundColor: '#32434e',
                    width: '200px',
                    color: 'white',
                  },
                }}
              >
                Continue shopping
              </Button>
            </Link>
            {navItems.map((item) => (
              <Button
                key={item.label}
                sx={{ color: router.pathname === item.path ? '#fff' : 'inherit',
}}
              >
                <Link href={item.path} className='text-[9px] md:text-[13px]'>
                  {item.label}
                </Link>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', 
            sm: 'none' 
          },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
          
        </Drawer>
      </nav>
    </Box>
  );
}


export default DrawerAppBar;