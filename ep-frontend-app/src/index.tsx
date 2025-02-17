import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { MantineProvider, Container, Loader } from "@mantine/core";
import { AuthProvider, LoaderProvider, LoggerProvider, ToastProvider } from './contexts';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import { Notifications } from '@mantine/notifications';
import { CssLoader } from './components/common/CssLoader/CssLoader';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <MantineProvider theme={{
    components: {
      Loader: Loader.extend({
        defaultProps: {
          loaders: { ...Loader.defaultLoaders, custom: CssLoader },
          type: 'custom',
        },
      }),
    },
  }}>
    <Notifications />
    <LoggerProvider>
      <ToastProvider>
        <LoaderProvider>
          <AuthProvider>
            <Container size={"xs"}>
              <Router>
                <App />
              </Router>
            </Container>
          </AuthProvider>
        </LoaderProvider>
      </ToastProvider>
    </LoggerProvider>
  </MantineProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
