import getAllMessages from '@/hooks/getAllMessages';
import getRealTimeMessages from '@/hooks/getRealTimeMessages';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const Messages = ({ selectedUser }) => {
  getRealTimeMessages();
  getAllMessages();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'Just now';

    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMilliseconds = now - createdDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInSeconds < 10) {
      return 'Just now';
    } else if (diffInMinutes < 1) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar>
            <AvatarImage
              className="rounded-full h-20 w-20 cursor-pointer "
              src={selectedUser?.profilePicture}
              alt={selectedUser?.username}
            />
            <AvatarFallback className="text-gray-600 font-semibold">
              {selectedUser.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.map((msg, index) => {
          const isSender = msg?.senderId === user?._id;
          
          return (
            <div
              key={index}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow-md ${
                  isSender
                    ? 'bg-insta-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.message}
                <span className="block text-xs text-gray-500 mt-1">
                  {getTimeAgo(msg?.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
