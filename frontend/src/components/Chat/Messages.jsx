import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const Messages = ({ selectedUser }) => {
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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              index % 2 === 0 ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow-md ${
                index % 2 === 0
                  ? 'bg-insta-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              Message {msg}
              <span className="block text-xs text-gray-500 mt-1">10:30 AM</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
