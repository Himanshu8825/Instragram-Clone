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

const Post = ({ post }) => {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'Just now';

    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMilliseconds = now - createdDate;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInSeconds < 10) {
      return 'Just now'; // 10 sec se kam ho to "Just now"
    } else if (diffInMinutes < 1) {
      return `${diffInSeconds} seconds ago`; // 10 sec se upar but 1 min se kam ho
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`; // 1 min se upar but 1 hour se kam ho
    } else if (diffInHours === 1) {
      return '1 hour ago'; // Exact 1 hour
    } else {
      return `${diffInHours} hours ago`; // 1 hour se upar ho to
    }
  };

  const changeEentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText('');
    }
  };

  return (
    <Card className=" w-full mx-auto border-none rounded-lg shadow-sm px-2 py-2 ">
      {/* Header - User Info */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post?.author?.profilePicture} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-semibold">{post?.author?.username}</p>
            <p className="text-xs text-gray-500">
              {getTimeAgo(post?.createdAt)}
            </p>
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
          src={post?.image}
          alt="Post"
          className="w-full object-cover h-[450px] object-top rounded"
        />
      </CardContent>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-1">
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
        <p className="text-sm font-semibold">{post?.likes?.length} likes</p>
        <p className="text-sm">
          <span className="font-semibold">{post?.author?.username} </span>
          {post?.caption}
        </p>
      </div>

      {/* View All Comments Link & Modal */}

      <CommentDilogue open={open} setOpen={setOpen} post={post} />

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
