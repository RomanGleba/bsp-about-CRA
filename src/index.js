import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { mainRouter } from './mainRouter';
import './styles/global.scss';
import './i18n.js';
import Errors from './components/errors/Errors';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Errors>
            <RouterProvider router={mainRouter} />
        </Errors>
    </React.StrictMode>
);
