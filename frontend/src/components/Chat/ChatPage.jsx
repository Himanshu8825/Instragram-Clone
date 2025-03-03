import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Messages } from '@/Index';
import { setSelectedUser } from '@/Redux/Slices/authSlices';
import { setMessages } from '@/Redux/Slices/chatSlice';
import axios from 'axios';
import { MessageCircleCode, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (state) => state.auth
  );

  const [message, setMessage] = useState('');
  const { onlineUsers, messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // console.log(onlineUsers);

  const sendMessageHandler = async (reciverId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/messages/send/${reciverId}`,
        { message },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );


      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setMessage('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex h-screen w-full">
      <div className="w-1/3 border-r bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-14 h-14 border border-gray-300 shadow-sm">
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
            <AvatarFallback className="text-gray-600 font-semibold">
              {user?.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {user?.username}
            </h2>
            <p className="text-sm text-gray-500">@{user?.username}</p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-600 mb-3">Messages</h3>

        <ScrollArea className="h-[calc(100vh-140px)]">
          {suggestedUsers?.map((user) => {
            const isOnline = onlineUsers.includes(user?._id);

            return (
              <div
                key={user._id}
                className="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
                onClick={() => dispatch(setSelectedUser(user))}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 border border-gray-300 shadow-sm">
                    <AvatarImage
                      src={user.profilePicture}
                      alt={user.username}
                    />
                    <AvatarFallback className="text-gray-600 font-semibold">
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {isOnline ? (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  ) : (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                  )}
                </div>

                <div className="flex flex-col">
                  <p className="font-medium text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-500">
                    {isOnline ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>

      {selectedUser ? (
        <div className="flex-1 flex flex-col bg-white">
          <div className="border-b p-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={selectedUser?.profilePicture}
                alt={selectedUser?.username}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-zinc-800 ">
                {selectedUser?.username}
              </p>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4 space-y-4">
            <Messages selectedUser={selectedUser} />
          </ScrollArea>
          <div className="border-t p-4 flex items-center gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 focus-visible:ring-transparent h-12 "
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className="bg-insta-primary hover:bg-insta-hoverPrimary h-8"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className=" w-32 h-32 my-4" />
          <h1>Your Messages</h1>
          <span>Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
