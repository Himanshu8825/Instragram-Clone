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
      

        dispatch(setLikeNotification(notification ));
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
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/profile/:id',
          element: <Profile />,
        },
        {
          path: '/account/edit',
          element: <EditProfile />,
        },
        {
          path: '/chat',
          element: <ChatPage />,
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
