import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from './use-toast';
import { setPosts } from '@/Redux/Slices/postSlice';

const GetAllPosts = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/posts/all`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          dispatch(setPosts(res.data.posts));
        //   console.log(res);
        }
      } catch (error) {
        console.log(error);
        toast({
          title: error?.response?.data?.message,
          variant: 'destructive',
        });
      }
    };
    fetchAllPosts();
  }, []);
};

export default GetAllPosts;
