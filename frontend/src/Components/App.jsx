import React, { useState } from 'react';
import AuthContext from '../Contexts/index.jsx';
import useAuth from '../Hooks/index.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './ChatPage';
import ErrorPage from './ErrorPage';
import LoginPage from './LoginPage';
import Header from './Header.jsx';
import SignUpPage from './SignUpPage.jsx';
import { useLocation } from 'react-router-dom';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [loggedIn, setLoggedIn] = useState(currentUser ? { username: currentUser.username } : null);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };
  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="d-flex flex-column h-100">
      <Header />
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="/" element={(
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>)} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;