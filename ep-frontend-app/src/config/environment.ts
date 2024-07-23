export const environment = {
    production: process.env.NODE_ENV === 'production',
    useLocalStorage: process.env.REACT_APP_USE_LOCAL_STORAGE === 'true',
    appPreferencesPrefix: process.env.REACT_APP_APP_PREFERENCES_PREFIX || 'ep:',
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://apiep.dev.orrizonte.in',
    authApiBaseUrl: process.env.REACT_APP_AUTH_API_URL || 'http://localhost:5001',
    userApiBaseUrl: process.env.REACT_APP_USER_API_URL || 'http://localhost:5002',
    adminApiBaseUrl: process.env.REACT_APP_ADMIN_API_URL || 'http://localhost:5003',
    pollingApiBaseUrl: process.env.REACT_APP_POLLING_API_URL || 'http://localhost:5004',
    encDecSecretKey: process.env.REACT_APP_ENC_DEC_SECRET_KEY || 'EP@$#&*(!@%^&',
    skipLoaderRoutes: [
        '/api/v1/auth/health'
    ]
};
  