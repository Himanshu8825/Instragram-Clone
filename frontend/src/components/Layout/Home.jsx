import { Feed, RightSidebar } from '@/Index';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default Home;
