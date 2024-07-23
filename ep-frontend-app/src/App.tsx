import logo from './logo.svg';
import './App.css';
import { useLoader } from './hooks/useLoader';
import { useToast } from './hooks/useToast';
import { setupInterceptors } from './api/axiosConfig';
import { AuthProvider, LoaderProvider, ToastProvider } from './contexts';

const App = () => {
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();

  setupInterceptors(showLoader, hideLoader, showToast);

  return (
    <ToastProvider>
      <LoaderProvider>
        <AuthProvider>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        </AuthProvider>
      </LoaderProvider>
    </ToastProvider>
  );
}

export default App;
