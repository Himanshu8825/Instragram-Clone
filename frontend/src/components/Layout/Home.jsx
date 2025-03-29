import getSuggestedUsers from '@/hooks/getSuggestedUsers';
import { AllUsers, Feed, GetAllPosts, RightSidebar } from '@/Index';

const Home = () => {
  GetAllPosts();
  getSuggestedUsers();
  return (
    <div className="flex w-full h-full">

      <AllUsers />
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
