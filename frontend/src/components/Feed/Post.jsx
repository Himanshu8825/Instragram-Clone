import { CommentDilogue } from '@/Index';
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';

const Post = () => {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  const changeEentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText('');
    }
  };

  return (
    <Card className="max-w-xl mx-auto border rounded-lg shadow-sm">
      {/* Header - User Info */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src=""
              alt="User"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-semibold">Suraj Kumar</p>
            <p className="text-xs text-gray-500">2 hours ago</p>
          </div>
        </div>

        {/* 3-Dot Menu for Unfollow */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-1 rounded-full cursor-pointer">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="p-4 rounded-lg shadow-lg max-w-xs text-center">
            <div className="flex flex-col mt-2 text-sm text-center">
              <div className="py-3 font-bold text-red-500 cursor-pointer">
                Unfollow
              </div>
              <div className="py-3 font-semibold cursor-pointer">
                Add to Favorites
              </div>
              <div className="py-3 font-semibold cursor-pointer">Delete</div>
              <DialogClose asChild>
                <div className="py-3 font-semibold cursor-pointer">Cancel</div>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <CardContent className="p-0">
        <img
          src="https://res.cloudinary.com/dh3nmgwdy/image/upload/v1739655129/ok02vsprcryhvabjpswg.jpg"
          alt="Post"
          className="w-full object-cover"
        />
      </CardContent>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-1 py-2">
        <div className="flex gap-1">
          <div className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
            <Heart className="w-5 h-5" />
          </div>
          <div className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
            <MessageCircle onClick={() => setOpen(true)} className="w-5 h-5" />
          </div>
          <div className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
            <Send className="w-5 h-5" />
          </div>
        </div>
        <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
          <Bookmark className="w-5 h-5" />
        </div>
      </div>

      {/* Like Count & Caption */}
      <div className="px-3">
        <p className="text-sm font-semibold">1,234 likes</p>
        <p className="text-sm">
          <span className="font-semibold">Suraj Kumar </span>
          This is an amazing Instagram post! 🚀✨
        </p>
      </div>

      {/* View All Comments Link & Modal */}

      <CommentDilogue open={open} setOpen={setOpen} />

      {/* Comment Input */}
      <div className="flex justify-center items-center px-3 py-2 border-t">
        <Input
          placeholder="Add a comment..."
          className="border-none focus-visible:ring-transparent pr-16"
          value={text}
          onChange={changeEentHandler}
        />
        {text && (
          <span className="text-insta-primary text-sm font-semibold">Post</span>
        )}
      </div>
    </Card>
  );
};

export default Post;
