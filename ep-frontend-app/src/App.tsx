import './App.css';
import React, { Suspense, lazy } from 'react';
import { useLoader } from './hooks/useLoader';
import { useToast } from './hooks/useToast';
import { setupInterceptors } from './api/axiosConfig';
import { Route, Routes } from 'react-router-dom';
import { useAuth, useLogger } from './hooks';
import LoadingFallback from './components/common/LoadingFallback/LoadingFallback';

// Lazy load components
const Header = lazy(() => import('./components/common/Header/Header'));
const Menu = lazy(() => import('./components/common/Menu/Menu'));
const Home = lazy(() => import('./components/pages/Home/Home'));
const Login = lazy(() => import('./components/pages/Login/Login'));
const Dashboard = lazy(() => import('./components/pages/Dashboard/Dashboard'));

const App = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const { setLogLevel, log } = useLogger();

  setLogLevel('info');
  setupInterceptors(showLoader, hideLoader, showToast, log);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Header />
      {isAuthenticated && <Menu />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
};

export default App;
