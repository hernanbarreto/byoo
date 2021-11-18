import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import security from '../../../images/svg/undraw_Security_on_re_e491.svg';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {  Divider } from '@material-ui/core';
import { useAuth } from '../../../services/firebase';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemIcon from '@mui/material/ListItemIcon';
import PasswordIcon from '@mui/icons-material/Password';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import GroupsIcon from '@mui/icons-material/Groups';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, 
    doc, 
    getDoc,
    updateDoc,
    arrayRemove,
        } from "firebase/firestore";
import '../../login/Login.css';
import { Button } from '@material-ui/core';
import Skeleton from '@mui/material/Skeleton';
import FormEliminarCuenta from './FormEliminarCuenta';
import { logout } from '../../../services/firebase';
import { emitCustomEvent } from 'react-custom-events';
import LoadingPage from '../../login/LoadingPage';
import Chip from '@mui/material/Chip';

const functions = getFunctions();
const deleteUser = httpsCallable(functions, 'deleteUser');
const verifyIdToken = httpsCallable(functions, 'verifyIdToken');
const revokeRefreshTokens = httpsCallable(functions, 'revokeRefreshTokens');
const getUser = httpsCallable(functions, 'getUser');

const database = getFirestore();
var sessions = [];
var listItems = null;

function LoginAndSecurity() {
    const history = useHistory ();
    const mobilAccess = !useMediaQuery('(min-width:769px)', { noSsr: true });
    const [loadingDialog, setLoadingDialog] = useState(false);

    const {currentUser} = useAuth();

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100px',
    }); 
    
    const handleCuenta = () => {
        history.push('/account-settings');          
    }

    const [createdOsName, setCreatedOsName] = useState(null);
    const [createdOsVersion, setCreatedOsVersion] = useState(null);
    const [createdLocationCity, setCreatedLocationCity] = useState(null);
    const [createdLocationCountry, setCreatedLocationCountry] = useState(null);
    const [createdLocationRegion, setCreatedLocationRegion] = useState(null);
    const [createdBrowser, setCreatedBrowser] = useState(null);
    const [createdDate, setCreatedDate] = useState(null);
    const [createdlenguaje, setCreatedLenguaje] = useState(null);
    const [loadingCreated, setLoadingCreated] = useState(true);
    const [userName, setUserName] = useState(null);
    const [openFormEliminarCuenta, setOpenFormEliminarCuenta] = useState(false);
    const [userEmail, setUserMail] = useState(null);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    const [listo, setListo] = useState(false);

    const handleUpdateProfile = async () => {
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                setUserName(docSnap.data().name.split(' ')[0]);
                setCreatedLenguaje(docSnap.data().account.created.location.lenguaje)
                setCreatedOsName(docSnap.data().account.created.os.name);
                setCreatedOsVersion(docSnap.data().account.created.os.version);
                setCreatedLocationCity(docSnap.data().account.created.location.city);
                setCreatedLocationCountry(docSnap.data().account.created.location.country);
                setCreatedLocationRegion(docSnap.data().account.created.location.region);
                setCreatedBrowser(docSnap.data().account.created.browser);
                setCreatedDate(docSnap.data().account.created.date);
                setLoadingCreated(false);
                setUserMail(currentUser.email);
                docSnap.data().sessions.forEach(e=>{
                    sessions.push(e);
                });
                setListo(true);
            }else{
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                })
                .catch((error)=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/error');
                });
            }
        }catch{
        } 
    }

    const clearStates = () => {
        setCreatedOsName(null);
        setCreatedOsVersion(null);
        setCreatedLocationCity(null);
        setCreatedLocationCountry(null);
        setCreatedLocationRegion(null);
        setCreatedBrowser(null);
        setCreatedDate(null);
        setCreatedLenguaje(null);
        setLoadingCreated(true);
        setUserMail(null);
        setUserName(null);
        sessions = [];
        listItems = null;
    }

    useEffect(() => {
        window.scrollTo(0,0);

        if (currentUser){
            verifyIdToken(currentUser.accessToken)
            .then(async (payload) => {
                const infoUser = doc(database, "users", currentUser.uid);
                const docSnap = await getDoc(infoUser);
                if (docSnap.exists()){
                    const filtered = docSnap.data().sessions.filter(function(element){
                        return element.id === currentUser.accessToken;
                    });
                    if (filtered.length !== 0){
                        clearStates();
                        handleUpdateProfile();    
                    }else{
                        logout()
                        .then(()=>{
                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                        })
                        .catch((error)=>{
                            console.log(error);
                            emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                        });    
                    }
                }else{
                    logout()
                    .then(()=>{
                        emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                    })
                    .catch((error)=>{
                        emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                    });    
                }
            })
            .catch((error) => {
              if (error.code === 'auth/id-token-revoked') {
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })
                .catch((error)=>{
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                });
              } else {
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })
                .catch((error)=>{
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                });
              }
            });
        }
    }, []);

    const handleEliminarCuenta = () => {
        setOpenFormEliminarCuenta(true);
    } 

    const handleClose = () => {
        setOpenFormEliminarCuenta(false);
    }

    const handleEliminar = () => {
        setOpenFormEliminarCuenta(false);
        setLoadingDialog(true);
        deleteUser(currentUser.uid)
        .then(()=>{
            logout()
            .then(()=>{
                setLoadingDialog(false);
                emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
            })
            .catch((error)=>{
                setLoadingDialog(false);
                emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
            });
        })
        .catch((error)=> {
            setLoadingDialog(false);
            emitCustomEvent('showMsg', 'Ocurrió un error al eliminar la cuenta ' + userEmail + '. No te preocupes, nosotros nos encargaremos de eliminarla./error');
        })
    }

    const breadcrumbs = [
        <Link
          key={1}
          underline="none"
          onClick={handleCuenta}
          sx={{
            color: '#222222 !important',
            textDecoration: "underline #222222",
            fontSize: '14px',
            cursor: 'pointer'
        }} 
        >
            Cuenta
        </Link>,
        <Typography color="text.primary" key={2}>
            Inicio de sesión y seguridad
        </Typography>,
    ];    
    
    const handleCerrarSesiones = () => {
        if (currentUser){
            setLoadingDialog(true);
            revokeRefreshTokens(currentUser.uid)
            .then(() => {
            return getUser(currentUser.uid);
            })
            .then((userRecord) => {
            return new Date(userRecord.data.tokensValidAfterTime).getTime()/1000;
            })
            .then((timestamp) => {
                logout()
                .then(()=>{
                    setLoadingDialog(false);
                })
                .catch((error)=>{
                    setLoadingDialog(false);
                });
            });
        }
    }

    const handleCLoseSessionDevice = async (i) => {
        const database = getFirestore();
        const infoUser = doc(database, "users", currentUser.uid);
        const docSnap = await getDoc(infoUser);
        if (docSnap.exists()) {
          const filtered = docSnap.data().sessions.filter(function(element){
              return element.id === sessions[i].id;
          });
          if (filtered.length !== 0){
            await updateDoc(infoUser, {
                sessions: arrayRemove(filtered[0])
            })
            .then(()=>{
                if (sessions[i].id === currentUser.accessToken){
                    setLoadingDialog(true);
                    clearStates();
                    handleUpdateProfile();    
                    logout()
                    .then(()=>{
                        setLoadingDialog(false);
                    })
                    .catch((error)=>{
                        setLoadingDialog(false);
                    });                    
                }else{
                    clearStates();
                    handleUpdateProfile();    
                }        
            })
            .catch(()=>{
                if (sessions[i].id === currentUser.accessToken){
                    clearStates();
                    handleUpdateProfile();    
                    logout()
                    .then(()=>{
                    })
                    .catch((error)=>{
                    });                    
                }else{
                    clearStates();
                    handleUpdateProfile();    
                }        
            });
          }else{
            if (sessions[i].id === currentUser.accessToken){
                clearStates();
                handleUpdateProfile();    
                logout()
                .then(()=>{
                })
                .catch((error)=>{
                });                    
            }else{
                clearStates();
                handleUpdateProfile();    
            }    
          }
        }else{
            logout()
            .then(()=>{
            })
            .catch((error)=>{
            });
        }
    }

    useEffect(() => {
        if (listo){
            setListo(false);
            listItems = sessions.map((session, index) =>
            <Paper
                key={index+1}
                variant='string'
                sx={{ 
                    p: 2, 
                    border: '1px solid lightgray',
                    borderRadius: '20px',
                }}
                style={{
                    marginBottom: '10px',
                }}
            >
                <Stack
                    key={index+1}
                    spacing={1}
                    style={{
                        marginTop: '0px',
                        marginBottom: '0px',
                    }}
                >
                    {(sessions[index].id === currentUser.accessToken) ?
                        <Chip size='small' color='success' label="SESIÓN ACTUAL" sx={{fontSize:'10px', maxWidth: '100px'}}/>
                    :null
                    }
                    <Typography key={(4*index)+1}><strong>{sessions[index].os.name}&nbsp;{sessions[index].os.version}</strong>&nbsp;•&nbsp;{sessions[index].browser}</Typography>                                    
                    <Typography key={(4*index)+2}>{sessions[index].location.city}&nbsp;•&nbsp;{sessions[index].location.region}&nbsp;•&nbsp;{sessions[index].location.country}</Typography>                                    
                    <Typography key={(4*index)+3}>{new Date(parseInt(sessions[index].date)).toLocaleDateString(sessions[index].location.lenguaje, options)}&nbsp;a las&nbsp;{new Date(parseInt(sessions[index].date)).toLocaleTimeString(sessions[index].location.lenguaje)}</Typography>
                    <Link
                        key={(4*index)+4}
                        underline="none"
                        onClick={(e, item) => {handleCLoseSessionDevice(index);}}
                        sx={{
                            display: 'flex',
                            justifyContent: 'right',
                            color: '#222222 !important',
                            fontSize: '14px',
                            cursor: 'pointer',
                            userSelect: 'none',
                        }} 
                        >
                            <strong>Cerrar sesión</strong>
                        </Link>
                </Stack>
            </Paper> 
            );    
        }
    }, [listo, currentUser]);

    return (
        <div>
            <LoadingPage 
                open={loadingDialog}
            />
            <FormEliminarCuenta
                open={openFormEliminarCuenta}
                name={userName}
                onGetClose={handleClose}
                onGetEliminar={handleEliminar}
            />
            <Container maxWidth="lg">
                <Box sx={{ flexGrow: 10 }}>
                    <Paper
                        variant='string' 
                        sx={{ 
                            marginTop: '50px', 
                            marginBottom: '50px', 
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={{ xs: 3, sm: 10, md: 15 }}
                            style={{
                                marginTop: '30px',
                                marginBottom: '30px',
                            }}
                        >
                            <Container maxWidth="md">
                                <Box>
                                    {!mobilAccess ?
                                        <Breadcrumbs
                                            separator={<NavigateNextIcon fontSize="small" />}
                                            aria-label="breadcrumb"
                                        >
                                            {breadcrumbs}
                                        </Breadcrumbs>
                                    :
                                    <Link
                                        component={ArrowBackIosIcon}
                                        onClick={handleCuenta}
                                        sx={{
                                            color: '#000000 !important',
                                            fontSize: '14px',
                                        }} 
                                    />
                                    }
                                    <Typography
                                        fontSize={{
                                            lg: 30,
                                            md: 30,
                                            sm: 25,
                                            xs: 25,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Inicio de sesión y seguridad</strong>
                                    </Typography>
                                    <Divider/>
                                    <Accordion
                                        sx={{
                                            marginTop: '40px',
                                            marginBottom: '20px',
                                        }}                                    
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-password"
                                            id="panel-password"
                                        >
                                        <ListItemIcon>
                                            <PasswordIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Contraseña</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>
                                            Datos de la contraseña
                                        </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}                                    
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-phone"
                                            id="panel-phone"
                                        >
                                        <ListItemIcon>
                                            <ContactPhoneIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Número de teléfono</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>
                                            Datos del teléfono
                                        </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '40px',
                                        }}                                    
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel-social"
                                            id="panel-social"
                                        >
                                        <ListItemIcon>
                                            <GroupsIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <Typography><strong>Proveedores externos</strong></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                        <Typography>
                                            Datos de ingreso de redes sociales
                                        </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Divider/>
                                    <Typography
                                        fontSize={{
                                            lg: 30,
                                            md: 30,
                                            sm: 25,
                                            xs: 25,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Sesiones activas</strong>
                                    </Typography>
                                    <Stack
                                        direction='column'
                                        style={{
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {listItems}
                                        <Button 
                                            variant='outlined'
                                            className='button__log__continuar'
                                            disableElevation
                                            onClick={handleCerrarSesiones}
                                        >
                                        Cerrar todas las sesiones
                                        </Button>
                                    </Stack>
                                    <Divider/>
                                    <Typography
                                        fontSize={{
                                            lg: 30,
                                            md: 30,
                                            sm: 25,
                                            xs: 25,
                                        }}                                                                                
                                        sx={{
                                            marginTop: '20px',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <strong>Datos de creación de cuenta</strong>
                                    </Typography>
                                    <Paper
                                        variant='string'
                                        sx={{ 
                                            p: 2, 
                                            border: '1px solid lightgray',
                                            borderRadius: '20px',
                                        }}
                                    >
                                    {!loadingCreated ?
                                    <Stack
                                        spacing={1}
                                        style={{
                                            marginTop: '0px',
                                            marginBottom: '0px',
                                        }}
                                    >
                                            <Typography><strong>{createdOsName}&nbsp;{createdOsVersion}</strong>&nbsp;•&nbsp;{createdBrowser}</Typography>                                    
                                            <Typography>{createdLocationCity}&nbsp;•&nbsp;{createdLocationRegion}&nbsp;•&nbsp;{createdLocationCountry}</Typography>                                    
                                            <Typography>{new Date(parseInt(createdDate)).toLocaleDateString(createdlenguaje, options)}&nbsp;a las&nbsp;{new Date(parseInt(createdDate)).toLocaleTimeString(createdlenguaje)}</Typography>
                                            <Button 
                                                variant='outlined'
                                                className='button__log__BW'
                                                disableElevation
                                                onClick={handleEliminarCuenta}
                                            >
                                            Elimina tu cuenta
                                            </Button>
                                        </Stack>
                                        :
                                        <Stack
                                            spacing={1}
                                            style={{
                                                marginTop: '0px',
                                                marginBottom: '0px',
                                            }}
                                        >
                                            <Skeleton variant="text" width="30%"/>
                                            <Skeleton variant="text" width="50%"/>
                                            <Skeleton variant="text" width="70%"/>
                                        </Stack>
                                        } 
                                    </Paper> 
                                </Box>
                            </Container>
                            <Container maxWidth="md"
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    width: '100%',
                                }}                            
                            >
                                <Paper
                                    variant='string'
                                    square={true}
                                    sx={{ 
                                        p: 2, 
                                        border: '1px solid lightgray',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            margin: '30px',
                                        }}                                        
                                    >
                                        <Img src={security} />
                                        <Typography 
                                            fontSize={{
                                                lg: 20,
                                                md: 20,
                                                sm: 15,
                                                xs: 15,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            <strong>Vamos a hacer que tu cuenta sea más segura</strong>
                                        </Typography>
                                        <Typography 
                                            fontSize={{
                                                lg: 15,
                                                md: 15,
                                                sm: 12,
                                                xs: 12,
                                            }}                                                                                
                                            sx={{marginTop: '20px'}}
                                        >
                                            Siempre estamos trabajando para aumentar la seguridad en nuestra comunidad. Por eso, revisamos todas las cuentas para asegurarnos de que sean lo más seguras posible.
                                        </Typography>
                                    </Box>
                                </Paper> 
                            </Container>
                        </Stack>
                    </Paper>
                </Box>
            </Container>
        </div>
    )
}

export default LoginAndSecurity
