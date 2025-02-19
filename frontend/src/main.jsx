import '@fontsource/inter';
import '@fontsource/poppins';
import '@fontsource/roboto'; // For Roboto font
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.jsx';
import { Toaster } from './components/ui/toaster';
import './index.css';
import store, { persistor } from './Redux/store.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <Toaster />
    </PersistGate>
  </Provider>
);
