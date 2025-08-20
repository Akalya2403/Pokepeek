import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MantineProvider } from "@mantine/core"
import { BrowserRouter } from 'react-router-dom';
import '@mantine/core/styles.css';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCss theme={{fontFamily:"poppins,sans-serif"}}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </MantineProvider>
</React.StrictMode>

);


