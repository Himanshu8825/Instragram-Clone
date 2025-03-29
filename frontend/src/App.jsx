import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  ChatPage,
  EditProfile,
  Home,
  Login,
  MainLayout,
  ProctedRoute,
  Profile,
  Signup,
} from './Index';
import { setOnlineUsers } from './Redux/Slices/chatSlice';
import { setLikeNotification } from './Redux/Slices/notification';
import { setSocket } from './Redux/Slices/socketSlice';

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:3000', {
        query: {
          userId: user?._id,
        },
        transports: ['websocket'],
      });

      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProctedRoute>
          <MainLayout />
        </ProctedRoute>
      ),
      children: [
        {
          path: '/',
          element: <ProctedRoute><Home /></ProctedRoute>,
        },
        {
          path: '/profile/:id',
          element: <ProctedRoute><Profile /></ProctedRoute>,
        },
        {
          path: '/account/edit',
          element:<ProctedRoute><EditProfile /></ProctedRoute> ,
        },
        {
          path: '/chat',
          element: <ProctedRoute><ChatPage /></ProctedRoute>,
        },
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
