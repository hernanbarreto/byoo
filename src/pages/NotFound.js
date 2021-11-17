import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import imgNotFound from '../images/svg/undraw_not_found_-60-pq.svg'
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useAuth } from '../services/firebase';
import { auth } from '../services/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";
import { emitCustomEvent } from 'react-custom-events';

const functions = getFunctions();
const verifyIdToken = httpsCallable(functions, 'verifyIdToken');

function NotFound () {
    const {currentUser} = useAuth();

    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    useEffect(() => {
        if (currentUser){
            verifyIdToken(currentUser.accessToken)
            .then((payload) => {
            })
            .catch((error) => {
                console.log(error);
              if (error.code === 'auth/id-token-revoked') {
                auth.signOut().then(()=> {
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                }).catch((error) => {
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })        
              } else {
                auth.signOut().then(()=> {
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                }).catch((error) => {
                    emitCustomEvent('showMsg', 'Se ha cerrado la sesión/error');
                })        
              }
            });
        }
    }, [currentUser]);

    const Img = styled('img')({
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    });     

return (
    <div>
        <Container maxWidth="xl">
            <Box sx={{ flexGrow: 10 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 3, sm: 10, md: 15 }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '100px',
                        marginBottom: '100px',
                    }}
                >
                    <Container maxWidth="xl">
                        <Img src={imgNotFound} />
                    </Container>
                    <Container maxWidth="xs">
                        <Stack
                            direction='column'
                            spacing={{ xs: 1 }}
                            style={{
                                alignItems: 'left',
                                justifyContent: 'left',
                            }}
                        >
                            <Typography variant='h2'>
                                <strong>¡Oops!</strong>
                            </Typography>
                            <Typography variant='h4'>
                                La página que buscas no existe.
                            </Typography>
                            <Typography variant='h6'>
                                <strong>Código de error: 404</strong>
                            </Typography>
                            <Typography variant='subtitle1'>
                                Revisá estos enlaces:
                            </Typography>
                            <Link to="/">
                                Buscar
                            </Link>
                            <Link to="/privacity">
                                Ayuda
                            </Link>
                        </Stack>
                    </Container>
                </Stack>
            </Box>
        </Container>
  </div>
)
}

export default NotFound;