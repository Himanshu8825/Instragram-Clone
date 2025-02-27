import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RightSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { suggestedUsers } = useSelector((state) => state?.auth || []);

  console.log(suggestedUsers.username);

  return (
    <div className=" pr-6 py-8 text-gray-900">
      {/* --- User Profile Section --- */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${user?._id}`}>
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Link>

          <div className="text-sm">
            <Link to={`/profile/${user?._id}`}>
              <p className="font-semibold">{user?.username}</p>
            </Link>
            <p className="text-gray-500 text-xs">
              {user?.bio || 'Bio here...'}
            </p>
          </div>
        </div>
        <button className="text-insta-primary text-xs font-semibold hover:insta-primary">
          Switch
        </button>
      </div>

      {/* --- Suggested for You Section --- */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold text-gray-500">Suggested for you</p>
        <button className="text-xs font-semibold hover:text-gray-700">
          See All
        </button>
      </div>

      {suggestedUsers?.map((suggested) => (
        <div
          key={suggested._id}
          className="flex justify-between items-center mb-3"
        >
          <div className="flex items-center gap-3">
            {/* Corrected Profile Link */}
            <Link to={`/profile/${suggested._id}`}>
              <Avatar className="w-10 h-10">
                {/* Show default image if profilePicture is empty */}
                <AvatarImage
                  src={
                    suggested.profilePicture
                      ? suggested.profilePicture
                      : ''
                  }
                  alt={suggested.username}
                />
                <AvatarFallback>
                  {suggested.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="text-xs">
              <Link to={`/profile/${suggested._id}`}>
                <p className="font-semibold">{suggested.username}</p>
              </Link>
              {/* Dynamic Followed by Message */}
              <p className="text-gray-500">
                {suggested.followers.length > 0
                  ? `Followed by ${suggested.followers.length} people`
                  : 'New to Instagram'}
              </p>
            </div>
          </div>

          {/* Follow Button */}
          <button className="text-insta-primary text-xs font-semibold hover:text-insta-hoverPrimary">
            Follow
          </button>
        </div>
      ))}

      {/* --- Footer Links (Static) --- */}
      <div className="text-gray-400 text-xs mt-5">
        <p>About · Help · Press · API · Careers · Privacy · Terms</p>
        <p className="mt-2">© 2025 Instagram Clone</p>
      </div>
    </div>
  );
};

export default RightSidebar;
