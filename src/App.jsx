// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';
import { AuthProvider } from 'src/contexts/AuthContext.js';

import { baselightTheme } from "./theme/DefaultColors";

function App() {
  
  const routing = useRoutes(Router);
  const theme = baselightTheme;

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {routing}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App