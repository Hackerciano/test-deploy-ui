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
        <AdminView></AdminView>
    </div>
  );
}

export default App;
