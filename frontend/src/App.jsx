import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { EditProfile, Home, Login, MainLayout, Profile, Signup } from './Index';

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
          path:'/profile/:id',
          element: <Profile />,
        },
        {
          path:'/account/edit',
          element: <EditProfile />,
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
