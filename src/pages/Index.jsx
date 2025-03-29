
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Simply redirect to login page
  return <Navigate to="/" replace />;
};

export default Index;
