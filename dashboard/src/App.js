import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider, CircularProgress } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';

const App = () => {
  const routing = useRoutes(routes);
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (!isAuthenticated && !isLoading) {
    loginWithRedirect();
    return (<CircularProgress>Loading ...</CircularProgress>);
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;
