/* eslint-disable react/jsx-no-constructed-context-values */

import React, { useState } from 'react';
import {
  BrowserRouter, Routes, Route, Navigate,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthContext from '../Contexts/index.jsx';
import useAuth from '../Hooks/index.jsx';
import ChatPage from './ChatPage';
import ErrorPage from './ErrorPage';
import LoginPage from './LoginPage';
import Header from './Header.jsx';
import SignUpPage from './SignUpPage.jsx';
import routes from '../Routes/routes.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('userId'));
  const [loggedIn, setLoggedIn] = useState(currentUser ? { username: currentUser.username } : null);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };
  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('userId'));

    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loggedIn,
      logIn,
      logOut,
      getAuthHeader,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to={routes.login()} state={{ from: location }} />
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="d-flex flex-column h-100">
        <Header />
        <Routes>
          <Route path={routes.error()} element={<ErrorPage />} />
          <Route path={routes.signup()} element={<SignUpPage />} />
          <Route
            path={routes.main()}
            element={(
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
)}
          />
          <Route path={routes.login()} element={<LoginPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
