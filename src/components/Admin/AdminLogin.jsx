import React, { useState } from "react";
import { Grid, Button, TextField } from "@mui/material";

export default function AdminLogin (props) {
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');

    let handleLogin = () => {
        if ((adminUser == process.env.REACT_APP_ADMIN_USER && adminPass == process.env.REACT_APP_ADMIN_PASS) || (process.env.NODE_ENV == 'development')) {
            document.cookie = "adminLogin=true";
            props.setLogin(true);
        } else {
            alert('Error, usuario o contraseña incorrectas');
        }
    }

    let LoginDialog = () => {
        return (
            <div>
                <Grid style={{maxWidth: '70%', margin: 'auto'}}>
                    <h1>Iniciar sesión</h1>
                    <h3>En caso de no contar con la contraseña favor de contactar al administrador</h3>
                    <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Usuario"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setAdminUser(e.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Contraseña"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={(e) => setAdminPass(e.target.value)}
                        />
                        <Button variant="outlined" style={{marginTop: '50px', marginBottom: '100px'}} onClick={() => handleLogin()}>Iniciar sesión</Button>
                </Grid>
            </div>
        )
    }

    return (
        <Grid style={{textAlign: 'center', margin: 'auto'}}>
            <LoginDialog></LoginDialog>
        </Grid>
    )
}