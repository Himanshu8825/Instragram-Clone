import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CreatePost } from '@/Index';
import { setAuthUser } from '@/Redux/Slices/authSlices';
import {
  setLikeNotification,
  clearNotificationBadge,
} from '@/Redux/Slices/notification';
import axios from 'axios';
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
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const { user } = useSelector((store) => store.auth);
  const { likeNotification, viewedNotifications } = useSelector(
    (state) => state.notification
  );
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/logout`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        dispatch(setAuthUser(null));
        navigate('/login');
        toast({
          title: res?.data?.message,
          variant: 'success',
        });
      }
    } catch (error) {
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
    } else if (item.text === 'Profile') {
      navigate(`/profile/${user?._id}`);
    } else if (item.text === 'Home') {
      navigate('/');
    } else if (item.text === 'Messages') {
      navigate('/chat');
    }
  };

  // Mark notifications as viewed (clear the badge)
  const clearNotifications = () => {
    dispatch(clearNotificationBadge());
    setPopoverOpen(false);
  };




  // Calculate unseen notifications
  const unseenNotifications = likeNotification.filter(
    (notification) => !viewedNotifications.includes(notification._id)
  );

  const sidebarItems = [
    { icon: <Home />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    { icon: <TrendingUp />, text: 'Explore' },
    { icon: <MessageCircle />, text: 'Messages' },
    {
      icon: (
        <div className='relative'>
          <Heart />
          {unseenNotifications.length > 0 && (
            <div className='absolute -top-2 -right-2 flex items-center justify-center h-4 w-4 bg-red-500 text-white text-xs rounded-full'>
              {unseenNotifications.length}
            </div>
          )}
        </div>
      ),
      text: 'Notifications',
    },
    { icon: <PlusSquare />, text: 'Create' },
    { icon: <LayoutDashboardIcon />, text: 'Dashboard' },
  ];

  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[20%] h-screen'>
      <div className='flex flex-col'>
        <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
        <div className='flex flex-col gap-4'>
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className='flex items-center gap-3 relative cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-200 transition-all duration-300 ease-in-out'
              onClick={() => sideHandler(item)}
            >
              {item.text === 'Notifications' ? (
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div
                      className='flex items-center gap-3'
                      onClick={() => setPopoverOpen(!popoverOpen)}
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className='p-4 bg-white shadow-lg'>
                    <div className='flex flex-col space-y-2 max-h-60 overflow-y-auto'>
                      {likeNotification.length > 0 ? (
                        likeNotification.map((notification, i) => (
                          <div
                            key={notification?.userDetails?._id}
                            className='flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition'
                          >
                            <Avatar className='w-8 h-8'>
                              <AvatarImage
                                src={notification.userDetails?.profilePicture}
                                alt={notification?.userDetails?.username}
                              />
                              <AvatarFallback>
                                {notification?.userDetails?.username?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className='text-sm'>
                              <strong>
                                {notification?.userDetails?.username}
                              </strong>{' '}
                              liked your post.
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className='text-gray-500 text-sm'>
                          No likes received yet.
                        </p>
                      )}
                    </div>
                    {likeNotification.length > 0 && (
                      <button
                        className='mt-2 w-full text-center text-sm text-blue-500 hover:underline'
                        onClick={clearNotifications}
                      >
                        Clear All
                      </button>
                    )}
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  {item.icon}
                  <span>{item.text}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
