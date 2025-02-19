import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';

const CommentDilogue = ({ open, setOpen , post }) => {
  const [text, setText] = useState("");

  const changeEentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText('');
    }
  };
  return (
    <Dialog className="border-none rounded-lg shadow-lg bg-white" open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="px-3 py-1 cursor-pointer text-gray-500 text-sm font-semibold">
          View all comments
        </div>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-3xl flex flex-col p-0 border-none outline-none shadow-none"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={post?.image}
              alt="Post"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center justify-between">
                <Link>
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={post?.author?.profilePicture}
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex items-center">
                  <Link>
                    <p className="text-sm font-semibold">{post?.author?.username}</p>
                  </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="pl-8 rounded-full cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
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
                    <div className="py-3 font-semibold cursor-pointer">
                      Delete
                    </div>
                    <DialogClose asChild>
                      <div className="py-3 font-semibold cursor-pointer">
                        Cancel
                      </div>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Comment Section */}
            <div className="space-y-3 mt-4 px-4 flex-1 overflow-y-auto">
              {/* Comment 1 */}
              <div className="flex items-center ">
                <p className="text-sm font-semibold text-zinc-800">
                  Suraj Kumar
                </p>
                <p className="text-sm text-gray-600 ml-2">
                  This is an amazing post!
                </p>
              </div>
              {/* Comment 2 */}
              <div className="flex items-center ">
                <p className="text-sm font-semibold text-zinc-800">
                  Suraj Kumar
                </p>
                <p className="text-sm text-gray-600 ml-2">
                  This is an amazing post!
                </p>
              </div>
              {/* Comment 3 */}
              <div className="flex items-center ">
                <p className="text-sm font-semibold text-zinc-800">
                  Suraj Kumar
                </p>
                <p className="text-sm text-gray-600 ml-2">
                  This is an amazing post!
                </p>
              </div>
              {/* Add more comments as needed */}
            </div>

            {/* Input Field */}
            <div className="px-1 py-2 flex items-center">
              <Input
                placeholder="Add a comment..."
                className="border-none focus-visible:ring-transparent pr-16"
                value={text}
                onChange={changeEentHandler}
              />
              {text && (
                <span className="text-insta-primary text-sm font-semibold px-2 cursor-pointer">
                  Post
                </span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDilogue;
