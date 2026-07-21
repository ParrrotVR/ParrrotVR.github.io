import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Monochrome from './Monochrome.jsx';
import './monochrome.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Monochrome />
  </StrictMode>
);
