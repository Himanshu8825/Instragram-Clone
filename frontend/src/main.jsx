import '@fontsource/inter';
import '@fontsource/poppins';
import '@fontsource/roboto'; // For Roboto font
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Toaster } from './components/ui/toaster';
import './index.css';

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster />
  </>
);
