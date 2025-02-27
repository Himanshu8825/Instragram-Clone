import { setSuggestedUsers } from '@/Redux/Slices/authSlices';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from './use-toast';

const getSuggestedUsers = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/suggested`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          dispatch(setSuggestedUsers(res?.data?.users));
        //   console.log(res?.data?.users);
        }
      } catch (error) {
        console.log(error);
        toast({
          title: error?.response?.data?.message,
          variant: 'destructive',
        });
      }
    };
    fetchAllSuggestedUsers();
  }, []);
};

export default getSuggestedUsers;
