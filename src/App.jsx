import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './pages/Login.jsx';
import PhotoBox from './pages/PhotoBox.jsx';
import { auth } from './Auth/Auth.js';
import { onAuthStateChanged } from 'firebase/auth';

export const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/photobox" /> : <LoginSignup />} 
        />
        <Route 
          path="/photobox" 
          element={user ? <PhotoBox /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
