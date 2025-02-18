import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home, Login, MainLayout, Profile, Signup } from './Index';

const App = () => {
  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path:'/profile',
          element: <Profile />,
        }
      ],
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/login',
      element: <Login />,
    },
  ]);

  return <RouterProvider router={browserRouter} />;
};

export default App;
