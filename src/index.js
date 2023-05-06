import React from 'react';
import { render } from 'react-dom';
import { createRoot } from 'react-dom/client'
import App from './App';

const container = document.getElementById('root')

render(
    <App /> ,
    container
)
