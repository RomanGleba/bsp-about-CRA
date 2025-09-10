import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import App from './App';
import Products from './pages/products/Products.jsx';
import PartnersPage from './pages/partners/Partners.jsx';

const Home     = lazy(() => import('./pages/home/Home.jsx'));
const About    = lazy(() => import('./pages/about/About.jsx'));
const Contacts = lazy(() => import('./pages/contact/Contact.jsx'));

const Fallback = <div style={{ padding: 24 }} />;

export const mainRouter = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Suspense fallback={Fallback}><Home /></Suspense> },
            { path: 'about', element: <Suspense fallback={Fallback}><About /></Suspense> },
            { path: 'products', element: <Products /> },
            { path: 'contacts', element: <Suspense fallback={Fallback}><Contacts /></Suspense> },
            { path: 'partners', element: <PartnersPage /> },

        ],
    },
]);
