import './App.css';
// import ScheduleClass from './components/ScheduleClass';
import AdminView from './components/Admin/AdminView';
import VertizVIPLogo from './assets/logo.svg';
import VertizLogo from './assets/logo.png';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { colors } from './themes/themeCons';
import {
  AppBar,
  CssBaseline,
  Toolbar,
  Box,
  Typography,
  Button,
  Link
} from "@mui/material";

function App() {
  const [adminView, setAdminView] = useState(false);

  let Copyright = () => {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Derechos reservados Vertiz Mobility solutions © '}
            <Link color="inherit" href="https://www.escuelasdemanejovertiz.com/">
                Ricardo Vertiz VIP
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

  let theme = createTheme({
      palette: {
          primary: {
              main: colors.violet,
          },
          secondary: {
              main: colors.orange,
          },
      },
  });

  theme = createTheme(theme, {
      palette: {
          info: {
              main: theme.palette.secondary.main,
          },
      },
  });

  useEffect(() => {
    let pathArray = window.location.pathname.split('/');
    let adminPath = pathArray[1] == 'admin';
    setAdminView(adminPath);
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Top bar */ }
            <AppBar position="sticky" sx={{ bgcolor: colors.pink, height: '70px' }}>
                <Toolbar>
                    <Box
                        component="img"
                        sx={{
                            height: 50,
                            width: 200,
                        }}
                        alt="The house from the offer."
                        src={VertizVIPLogo}
                    />
                    <Typography sx={{ flexGrow: 9 }}></Typography>
                </Toolbar>
            </AppBar>
            {/* End Top bar */ }


            {
            adminView
            ?
            <AdminView></AdminView>
            :
            <h1>Hello World</h1>
            // <ScheduleClass></ScheduleClass>
            }



            {/* Footer */}
              <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <img src={VertizLogo} style={{width: '100px'}}></img>
                <Typography variant="h6" align="center" gutterBottom>
                    Ricardo Vertiz VIP App V1.0
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    La mejor escuela de manejo en Guadalajara
                </Typography>
                <Copyright />
            </Box>
            {/* End footer */}
        </ThemeProvider>
    </div>
  );
}

export default App;
