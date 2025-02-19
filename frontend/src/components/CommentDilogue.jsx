import { useToast } from '@/hooks/use-toast';
import { setPosts, setSelectedPost } from '@/Redux/Slices/postSlice';
import axios from 'axios';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';

const CommentDilogue = ({ open, setOpen, post }) => {
  const { posts } = useSelector((state) => state.post);
  const { selectedPost } = useSelector((state) => state.post);
  const [text, setText] = useState('');
  const [comment, setComment] = useState(post.comments);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const { toast } = useToast();

  const changeEentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText('');
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/posts/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        const newComment = res.data.comment;
        const updatedCommentData = [...comment, newComment];

        // Update local comment state
        setComment(updatedCommentData);

        // ✅ Update selectedPost in Redux store
        const updatedSelectedPost = {
          ...post,
          comments: updatedCommentData,
        };
        dispatch(setSelectedPost(updatedSelectedPost));

        const updatedPostData = posts.map((item) =>
          item._id === post._id
            ? { ...item, comments: updatedCommentData }
            : item
        );
        dispatch(setPosts(updatedPostData));

        toast({
          title: 'Comment added successfully',
          variant: 'success',
        });

        setText('');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data?.message || 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  console.log(selectedPost);

  return (
    <Dialog
      className="border-none rounded-lg shadow-lg bg-white"
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-3xl flex flex-col p-0 border-none outline-none shadow-none"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="Post"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          <div className="w-1/2 flex flex-col">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center justify-between">
                <Link>
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={selectedPost?.author?.profilePicture}
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex items-center">
                  <Link>
                    <p className="text-sm font-semibold">
                      {selectedPost?.author?.username}
                    </p>
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

            {/* Comment Section (Scrollable) */}
            <div className="border-t-2 px-4 flex-1 min-h-0 overflow-y-auto max-h-[450px] scrollbar-hide">
              {selectedPost?.comments?.length > 0 ? (
                selectedPost.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-center mt-4 gap-2"
                  >
                    {/* Avatar */}
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={comment?.author?.profilePicture}
                        alt={comment?.author?.username}
                      />
                      <AvatarFallback>
                        {comment?.author?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Comment Content */}
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-zinc-800">
                        {comment?.author?.username}
                      </p>
                      <p className="text-sm text-gray-600">{comment?.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
            </div>

            {/* Input Field (Fixed at Bottom) */}
            <div className="px-1 py-2 flex items-center border-t mt-auto">
              <Input
                placeholder="Add a comment..."
                className="border-none focus-visible:ring-transparent pr-16"
                value={text}
                onChange={changeEentHandler}
              />
              {text && (
                <span
                  onClick={commentHandler}
                  className="text-insta-primary text-sm font-semibold px-2 cursor-pointer"
                >
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
