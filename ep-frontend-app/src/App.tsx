import './App.css';
import React, { Suspense } from 'react';
import { useLoader } from './hooks/useLoader';
import { useToast } from './hooks/useToast';
import { setupInterceptors } from './api/axiosConfig';
import { AuthProvider, LoaderProvider, ToastProvider } from './contexts';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks';
import LoadingFallback from './components/common/LoadingFallback/LoadingFallback';

const Header = React.lazy(() => import('./components/common/Header/Header'));
const Menu = React.lazy(() => import('./components/common/Menu/Menu'));
const Home = React.lazy(() => import('./components/pages/Home/Home'));
const Login = React.lazy(() => import('./components/pages/Login/Login'));
const Dashboard = React.lazy(() => import('./components/pages/Dashboard/Dashboard'));

const App = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  setupInterceptors(showLoader, hideLoader, showToast);

  return (
    <ToastProvider>
      <LoaderProvider>
        <AuthProvider>
        <Suspense fallback={<LoadingFallback/>}>
            <Header />
            {isAuthenticated && <Menu />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </LoaderProvider>
    </ToastProvider>
  );
}

export default App;
