import { setMessages } from '@/Redux/Slices/chatSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const getRealTimeMessages = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socketio);
  const { messages } = useSelector((state) => state.chat);




  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });

    return () => {
      socket?.off('newMessage');
    };
  }, [messages, dispatch]);
};

export default getRealTimeMessages;
