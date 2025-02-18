import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

export const sidebarItems = [
  { icon: <Home />, text: 'Home' },
  { icon: <Search />, text: 'Search' },
  { icon: <TrendingUp />, text: 'Explore' },
  { icon: <MessageCircle />, text: 'Messages' },
  { icon: <Heart />, text: 'Notifications' },
  { icon: <PlusSquare />, text: 'Create' },
  {icon: <LayoutDashboardIcon/> , text: 'Dashboard' },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
  { icon: <LogOut />, text: 'Logout' },
];
