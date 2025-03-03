import { setMessages } from '@/Redux/Slices/chatSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const getAllMessages = () => {
  const dispatch = useDispatch();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const { selectedUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAllSMessages = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/messages/all/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setMessages(res?.data?.messages));
          //   console.log(res?.data?.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllSMessages();
  }, [selectedUser]);
};

export default getAllMessages;
