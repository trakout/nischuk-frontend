import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './Layout';
import { HomeContainer } from '../container/HomeContainer';
import { PortfolioContainer } from '../container/PortfolioContainer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomeContainer /> },
      { path: 'portfolio', element: <PortfolioContainer /> },
    ],
  },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
