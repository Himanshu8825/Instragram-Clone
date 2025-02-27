import getUserProfile from '@/hooks/getUserProfile';
import { Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

const Profile = () => {
  const { id: userId } = useParams();
  getUserProfile(userId);

  const { userProfile, user } = useSelector((state) => state.auth);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('post');

  const isCurrentUser = user?._id === userProfile?._id;
  const displayedPosts =
    activeTab === 'post' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className=" my-8 px-8 ">
      {/* Profile Header */}
      <div className="flex items-center justify-center">
        <div className=" flex  items-center gap-8 mb-8">
          {/* Profile Picture */}
          <Avatar className="w-32 h-32 cursor-pointer">
            <AvatarImage
              src={userProfile?.profilePicture}
              alt={userProfile?.username}
            />
            <AvatarFallback>
              {userProfile?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{userProfile?.username}</h2>
              {isCurrentUser ? (
                <div className="flex gap-2">
                  <Link to={'/account/edit'}>

                    <Button variant="secondary" className="text-sm h-7">
                      Edit Profile
                    </Button>
                  </Link>
                  <Button variant="secondary" className="text-sm h-7">
                    View Archive
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`text-sm h-7 ${
                      isFollowing
                        ? 'bg-gray-200 hover:bg-gray-300 text-black'
                        : 'bg-insta-primary hover:bg-insta-hoverPrimary text-white'
                    }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                  <Button className="text-sm h-7 bg-gray-200 text-black hover:bg-gray-300">
                    Message
                  </Button>
                </div>
              )}
            </div>
            {/* Followers/Following Count */}
            <div className="flex gap-6 text-sm mt-2">
              <span>
                <strong>{userProfile?.posts?.length}</strong> Posts
              </span>
              <span>
                <strong>{userProfile?.followers?.length}</strong> Followers
              </span>
              <span>
                <strong>{userProfile?.following?.length}</strong> Following
              </span>
            </div>
            {/* Bio */}
            <p className="text-sm text-gray-500 mt-2">{userProfile?.bio}</p>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="border-t border-gray-200 w-full">
        <div className="flex items-center justify-center gap-10 text-sm py-3">
          {['post', 'reels', 'saved', 'tags'].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer ${
                activeTab === tab ? 'font-bold' : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-2 w-full mt-4">
        {displayedPosts?.map((post, index) => (
          <div key={index} className="relative group cursor-pointer">
            {/* Post Image */}
            <img
              src={post.image}
              alt="Post"
              className="w-full aspect-square object-cover transition-transform duration-500 "
            />

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="flex gap-4 text-white text-lg font-semibold">
                {/* Likes */}
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>{post.likes?.length || 0}</span>
                </div>
                {/* Comments */}
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
