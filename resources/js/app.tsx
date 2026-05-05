import './bootstrap';
// Forces Vite to compile your Tailwind CSS

import React from 'react';
import { createRoot } from 'react-dom/client';
import Welcome from './welcome';

const el = document.getElementById('app');
if (el) {
    const root = createRoot(el);
    root.render(<Welcome />);
}