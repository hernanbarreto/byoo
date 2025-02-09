import React, { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import personalInfo from '../../images/svg/undraw_personal_info_0okl.svg';
import security from '../../images/svg/undraw_Security_on_re_e491.svg';
import notifications from '../../images/svg/undraw_selection_re_ycpo.svg';
import social from '../../images/svg/undraw_Social_bio_re_0t9u.svg';
import generalPreferences from '../../images/svg/undraw_Active_options_re_8rj3.svg';
import professionalTools from '../../images/svg/undraw_qa_engineers_dg-5-p.svg';
import { auth } from '../../services/firebase';
import Link from '@mui/material/Link';
import { useHistory } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import FormEliminarCuenta from './login-and-security/FormEliminarCuenta';
import { useAuth } from '../../services/firebase';
import { emitCustomEvent } from 'react-custom-events';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, 
    doc, 
    getDoc } from "firebase/firestore";
import { logout } from '../../services/firebase';
import { useInitPage } from '../useInitPage';
import Skeleton from '@mui/material/Skeleton';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '150px',
}); 

const elevation = 5;
const minHeight = 320;
const functions = getFunctions();
const deleteUser = httpsCallable(functions, 'deleteUser');

const database = getFirestore();

function Account() {
    const {currentUser} = useAuth();
    const [userName, setUserName] = useState(null);
    const [openFormEliminarCuenta, setOpenFormEliminarCuenta] = useState(false);
    const [userEmail, setUserMail] = useState(null);
    const {state} = useInitPage();
    const [isMounted, setIsMounted] = useState(true);
    const [loading, setLoading] = useState(true);

    const clearStates = useCallback(() => {
        if(isMounted){
        setUserMail(null);
        setUserName(null);
        }
    },[isMounted]);

    const handleUpdateProfile = useCallback(async () => {
        setLoading(true);
        const infoUser = doc(database, "users", currentUser.uid);
        try{                                  
            const docSnap = await getDoc(infoUser);
            if (docSnap.exists()) {
                if(isMounted){
                setUserName(docSnap.data().name.split(' ')[0]);
                setUserMail(currentUser.email);
                setLoading(false)
                }
            }else{
                logout()
                .then(()=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/info');
                    emitCustomEvent('loged', false);
                    console.log('error')
                })
                .catch((error)=>{
                    emitCustomEvent('showMsg', 'Ha ocurrido un error al intentar acceder a los datos de tu cuenta/info');
                    emitCustomEvent('loged', false);
                    console.log('error')
                });
            }
        }catch{
        } 
    },[currentUser, isMounted]);

    useEffect(() => {
        setIsMounted(true);
        if (state !== null){
            if (state){
                clearStates();
                handleUpdateProfile();
            }
        }
        return () => {setIsMounted(false)}
    }, [state, handleUpdateProfile, clearStates]);

    const history = useHistory ();

    const handlePerfil = () => {
        history.push('/users?show='+String(currentUser.uid));          
    }

    const handlePersonalInfo = () => {
        history.push('/account-settings/personal-info');          
    }

    const handleSesionAndSeg = () => {
        history.push('/account-settings/login-and-security');          
    }

    const handleNotifications = () => {
        history.push('/account-settings/notifications');          
    }

    const handleSocial = () => {
        history.push('/account-settings/privacy-and-sharing');          
    }

    const handlePreferences = () => {
        history.push('/account-settings/preferences');          
    }

    const handleProfesionalTools = () => {
        history.push('/account-settings/professional-tools');          
    }

    const handleEliminarCuenta = () => {
        setOpenFormEliminarCuenta(true);
    } 

    const handleClose = () => {
        setOpenFormEliminarCuenta(false);
    }

    const handleEliminar = () => {
        setOpenFormEliminarCuenta(false);
        emitCustomEvent('openLoadingPage', true);
        deleteUser(currentUser.uid)
        .then(()=>{
            logout()
            .then(()=>{
                emitCustomEvent('openLoadingPage', false);
                emitCustomEvent('loged', false);
                if (userEmail !==null ){
                    emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
                }else{
                    emitCustomEvent('showMsg', 'Hemos eliminado tu cuenta/info');
                }
            })
            .catch((error)=>{
                emitCustomEvent('openLoadingPage', false);
                emitCustomEvent('loged', false);
                if (userEmail !==null ){
                    emitCustomEvent('showMsg', 'Hemos eliminado la cuenta ' + userEmail + '/info');
                }else{
                    emitCustomEvent('showMsg', 'Hemos eliminado tu cuenta/info');
                }
            });
        })
        .catch((error)=> {
            emitCustomEvent('openLoadingPage', false);
            if (userEmail !==null ){
                emitCustomEvent('showMsg', 'Ocurrió un error al eliminar la cuenta ' + userEmail + '. No te preocupes, nosotros nos encargaremos de eliminarla./error');
            }else{
                emitCustomEvent('showMsg', 'Ocurrió un error al eliminar tu cuenta. No te preocupes, nosotros nos encargaremos de eliminarla./error');
            }
        })
    }

    return (
        <div>
            <FormEliminarCuenta
                open={openFormEliminarCuenta}
                name={userName}
                onGetClose={handleClose}
                onGetEliminar={handleEliminar}
            />
            <Container maxWidth='lg'>
                <Box sx={{minHeight: '100vh'}}>
                    <Typography 
                        variant='h4'
                        sx={{
                            pt: '50px',
                        }}
                    >
                        <strong>Cuenta</strong>
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{
                            marginTop: '10px',
                            marginBottom: '50px',
                        }}
                    >
                    {!loading ?
                        <> 
                        <Typography 
                            variant='subtitle1'
                        >
                            <strong>{auth.currentUser.displayName}</strong>
                            {userEmail ?
                                <em>,&nbsp;</em>
                            :
                                null
                            }
                        </Typography>
                        <Typography 
                            variant='subtitle1'
                        >
                            {auth.currentUser.email}&nbsp;{'•'}&nbsp;
                        </Typography>
                        <Typography 
                            variant='subtitle1'
                        >
                            <Link
                                component="button"
                                onClick={handlePerfil}
                                sx={{
                                    textDecoration: "underline #5472AD",
                                    color: '#5472AD !important',
                                    fontSize: '16px',
                                }} 
                            >
                                <strong>Ir al perfil</strong>
                            </Link>
                        </Typography>
                        </>
                    :
                    <>
                    <Skeleton variant="text" width="20%"/>
                    <Skeleton variant="text" width="30%"/>
                    <Skeleton variant="text" width="10%"/>
                    </>
                    }
                    </Stack>
                    <Grid 
                        container 
                        spacing={{ xs: 2, md: 3 }} 
                        columns={{ xs: 1, sm: 8, md: 12 }}
                        direction={{ xs: 'column', sm: 'row' }}
                    >
                        <Grid item xs={2} sm={4} md={4} key={1}>
                            <Paper 
                                onClick={handlePersonalInfo}
                                elevation={elevation}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px',
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: minHeight,    
                                    }}                                                                
                                >
                                    <Grid item>
                                        <Img src={personalInfo}/>
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Información personal</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Proporcioná tus datos personales para que la comunidad pueda ponerse en contacto con vos.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={2} >
                            <Paper 
                                onClick={handleSesionAndSeg}
                                elevation={elevation}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px'
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',   
                                        minHeight: minHeight,                                            
                                    }}                                                                
                                >
                                    <Grid item >
                                        <Img src={security} />
                                    </Grid>
                                    <Grid item sm container >
                                        <Grid item container spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Inicio de sesión y seguridad</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Configurá el inicio de sesión de tu cuenta.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={3} >
                            <Paper 
                                onClick={handleNotifications}
                                elevation={elevation}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px',
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: minHeight,    
                                    }}                                
                                >
                                    <Grid item>
                                        <Img src={notifications} />
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Notificaciones</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Elegí las preferencias de notificación y tu forma de contacto.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={4} >
                            <Paper 
                                onClick={handleSocial}
                                elevation={elevation}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px'
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: minHeight,    
                                    }}                                                                
                                >
                                    <Grid item>
                                        <Img src={social} />
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Privacidad y uso compartido</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Controlá las aplicaciones conectadas, lo que compartís y quién puede verlo.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={5} >
                            <Paper 
                                onClick={handlePreferences}
                                elevation={elevation}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px'
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: minHeight,    
                                    }}                                                                
                                >
                                    <Grid item>
                                        <Img src={generalPreferences} />
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                    <strong>Preferencias generales</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    Configurá las preferencias de tu cuenta.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4} key={6} >
                            <Paper 
                                onClick={handleProfesionalTools}
                                elevation={elevation}
                                sx={{ 
                                    p: 2, 
                                    margin: 'auto', 
                                    maxWidth: 500, 
                                    flexGrow: 1, 
                                    cursor: 'pointer', 
                                    borderRadius: '10px'
                                }}
                            >
                                <Grid container spacing={2} direction="column"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        minHeight: minHeight,    
                                    }}                                                                
                                >
                                    <Grid item>
                                        <Img src={professionalTools} />
                                    </Grid>
                                    <Grid item sm container>
                                        <Grid item container direction="column" spacing={2}>
                                            <Grid item >
                                                <Typography gutterBottom variant="h6" component="div">
                                                <strong>Herramientas para profesionales</strong>
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                Conseguí herramientas para profesionales que byOO tiene a tu disposición.
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Typography 
                        variant='subtitle1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '50px',
                        }}
                    >
                        ¿Necesitás desactivar tu cuenta?
                    </Typography> 
                    <Typography 
                        variant='subtitle1'
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Link
                            component="button"
                            onClick={handleEliminarCuenta}
                            sx={{
                                color: '#5472AD !important',
                                fontSize: '14px',
                                marginBottom: '50px',
                            }} 
                        >
                            <strong>Resolvelo ahora</strong>
                        </Link>
                    </Typography> 
                </Box>
            </Container>
        </div>
    )
}

export default Account