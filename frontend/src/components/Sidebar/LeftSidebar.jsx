import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Heart,
  Home,
  LayoutDashboardIcon,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from 'lucide-react';
// import { sidebarItems } from '@/utils/constan';
import { CreatePost } from '@/Index';
import { setAuthUser } from '@/Redux/Slices/authSlices';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/logout`, {
        withCredentials: true,
      });
      console.log(res);

      if (res.status === 200) {
        dispatch(setAuthUser(null));
        navigate('/login');
        toast({
          title: res?.data?.message,
          variant: 'success',
        });
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast({
        title: error?.response?.data?.message,
        variant: 'destructive',
      });
    }
  };

  const sideHandler = (item) => {
    if (item.text === 'Logout') {
      handleLogout();
    } else if (item.text === 'Create') {
      setOpen(true);
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    { icon: <TrendingUp />, text: 'Explore' },
    { icon: <MessageCircle />, text: 'Messages' },
    { icon: <Heart />, text: 'Notifications' },
    { icon: <PlusSquare />, text: 'Create' },
    { icon: <LayoutDashboardIcon />, text: 'Dashboard' },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut />, text: 'Logout' },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[20%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div className="flex flex-col gap-4">
          {sidebarItems.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-3 relative cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-200 transition-all duration-300 ease-in-out"
                onClick={() => sideHandler(item)}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
