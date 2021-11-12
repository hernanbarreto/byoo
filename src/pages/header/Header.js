import React, {  useState, useEffect } from 'react';
import { auth } from '../../services/firebase';
import logo from './byOO_1.svg';
import Login from '../login/Login'
import DehazeIcon from '@material-ui/icons/Dehaze';
import { Button, Divider } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import LogoutIcon from '@mui/icons-material/Logout';
import './Header.css';
import { getFirestore, 
    doc, 
    getDoc } from "firebase/firestore";

import { useAuth } from '../../services/firebase';

const database = getFirestore();

function Header(details) {
    const history = useHistory ();
    const [anchorEl, setAnchorEl] = useState(null);
    const [photoURL, setPhotoURL] = useState(null);
    const [openLogin, setOpenLogin] =useState(false);
    const open = Boolean(anchorEl);    
    const {currentUser} = useAuth();

    const handleClick = (event) => {      
        setAnchorEl(event.currentTarget);
    }
    
    const handleClose = () => {
        setAnchorEl(null);
    }
  
    const handleRegistrate = (event) => {
        setAnchorEl(null);
        setOpenLogin(true);
    }
  
    const handleIniSec = (event) => {
        setAnchorEl(null);
        setOpenLogin(true);
    }

    const handleCloseLogin = () => {
        setOpenLogin(false);
    }
    
    const handleAyuda = (event) => {
        history.push('/privacity');          
        setAnchorEl(null);
    }
    
    const handleCuenta = () => {
        history.push('/account-settings');          
        setAnchorEl(null);
    }

    const handleLogout = () => {
        auth.signOut().then(()=> {
            handleClose(null);
        }).catch((error) => {
          console.log(error.message);
        })
    } 
  
    const handleUpdateProfile = async () => {
        setOpenLogin(false);
        const infoUser = doc(database, "users", auth.currentUser.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                setPhotoURL(docSnap.data().profilePhoto);
            }
        }catch{
            console.log('');
        } 
    }


    useEffect(() => {
        if (currentUser){
            handleUpdateProfile();
        }
    }, [currentUser]);

    return (
        <div className='header'>
        {/*<Container maxWidth="xl">*/}
            <Link to='/'>
                <img
                    className='header__icon'
                    src={logo}
                    alt='logo'
                />            
            </Link>
            <div className='header__right'>
                { !currentUser ?
                    <Button className='header__servButton' disableFocusRipple={true}>
                        Presto Servicios
                    </Button>
                :
                    <Button className='header__servButton' disableFocusRipple={true}>
                        Mis Servicios
                    </Button>
                }
                <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick} className='header__logButton' disableFocusRipple={true}>
                    <DehazeIcon className='header__barras'/>
                    {currentUser &&
                        /*
                        <Badge 
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            overlap="circular" 
                            color='error'
                            badgeContent="101" 
                        >
                        */
                            <Badge 
                                overlap="circular"
                                anchorOrigin={{ 
                                    vertical: "bottom", 
                                    horizontal: "right" 
                                }}
                                badgeContent={
                                        <Avatar sx={{bgcolor: '#44b700', color: '#44b700', width: 8, height: 8}}/>
                                }
                            >                
                                <Avatar className='header__avatar' src={photoURL} />
                            </Badge>
                        /*</Badge>*/
                    }
                    {!currentUser &&
                        <Avatar className='header__avatar'>
                            <AccountCircleIcon className='header__circleIcon'/>
                        </Avatar>
                    }
                </Button>
                { !currentUser &&
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        PaperProps={{
                            style: {
                                borderRadius: 10,
                                transform: 'translateX(-4.5vw) translateY(55px)',
                            }
                        }}
                    > 
                    <MenuItem onClick={handleRegistrate} className='login__menu__item'>
                        <ListItemIcon>
                            <AppRegistrationIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Registrate</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleIniSec} className='login__menu__item'>
                        <ListItemIcon>
                            <LoginIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Iniciá sesión</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleAyuda} className='login__menu__item'>
                        <ListItemIcon>
                            <HelpCenterIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Ayuda</Typography>
                    </MenuItem>
                    </Menu>
                }
                { currentUser &&
                    <Menu
                        id="fade-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Fade}
                        PaperProps={{
                            style: {
                                borderRadius: 10,
                                transform: 'translateX(-5vw) translateY(55px)',
                            }
                        }}
                    > 
                    <MenuItem className='login__menu__item'>
                        <ListItemIcon>
                            {/*<Badge 
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                overlap="circular" 
                                color='error'
                                badgeContent="1" 
                            >*/}
                                <MessageIcon fontSize="medium" />
                            {/*</Badge>*/}
                        </ListItemIcon>
                        <Typography variant="inherit">Mensajes</Typography>
                    </MenuItem>
                    <MenuItem className='login__menu__item'>
                        <ListItemIcon>
                            {/*<Badge 
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    overlap="circular" 
                                    color='error'
                                    badgeContent="1" 
                                >*/}
                                <NotificationsIcon fontSize="medium" />
                            {/*</Badge>*/}
                        </ListItemIcon>
                        <Typography variant="inherit">Notificaciones</Typography>
                    </MenuItem>
                    <MenuItem className='login__menu__item'>
                        <ListItemIcon>
                            <FavoriteIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Favoritos</Typography>                
                    </MenuItem>
                    <MenuItem onClick={handleCuenta} className='login__menu__item'>
                        <ListItemIcon>
                            {/*<Badge 
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    overlap="circular" 
                                    color='error'
                                    badgeContent="1" 
                                >*/}
                                <AccountCircleIcon fontSize="medium" />
                            {/*</Badge>*/}
                        </ListItemIcon>
                        <Typography variant="inherit">Cuenta</Typography>                
                    </MenuItem>
                    <Divider />
                    <MenuItem className='login__menu__item'>
                        <ListItemIcon>
                            <HomeRepairServiceIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Modo prestador de servicios</Typography>                
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleAyuda} className='login__menu__item'>
                        <ListItemIcon>
                            <HelpCenterIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Ayuda</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout} className='login__menu__item'>
                        <ListItemIcon>
                            <LogoutIcon fontSize="medium" />
                        </ListItemIcon>
                        <Typography variant="inherit">Cerrar sesión</Typography>                
                    </MenuItem>
                    </Menu>
                }
                <Login
                    userDetails={details}
                    open={openLogin}
                    onGetClose={handleCloseLogin}
                    onGetUpdateProfile={handleUpdateProfile}
                />
        </div>
    {/*</Container>*/}
    </div>
    )
}

export default Header