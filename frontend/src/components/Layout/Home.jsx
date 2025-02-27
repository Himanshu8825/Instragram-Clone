import getSuggestedUsers from '@/hooks/getSuggestedUsers';
import { Feed, GetAllPosts, RightSidebar } from '@/Index';

const Home = () => {
  GetAllPosts();
  getSuggestedUsers();
  return (
    <div className="flex w-full h-full">
      {/* Feed Section - Centered */}
      <div className="flex-1 flex justify-center">
        <Feed />
      </div>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};

export default Home;
