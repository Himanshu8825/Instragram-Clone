import { useToast } from '@/hooks/use-toast';
import { CommentDilogue } from '@/Index';
import { setPosts, setSelectedPost } from '@/Redux/Slices/postSlice';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkCheck,
  Heart,
  MessageCircle,
  MoreHorizontal,
  SendHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';

const Post = ({ post }) => {
  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
  const { selectedPost } = useSelector((state) => state.post);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [isBookMarked, setIsBookMarked] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const { toast } = useToast();

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

  const changeEentHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText('');
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/posts/delete/${post._id}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );

        dispatch(setPosts(updatedPost));
        toast({
          title: res?.data?.message,
          variant: 'success',
        });

        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data?.message,
        variant: 'destructive',
      });
    }
  };

  const likeDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(
        `${API_BASE_URL}/posts/${post._id}/${action}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        const updatedPost = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedPost);
        setLiked(!liked);

        const updatedPostData = posts.map((item) =>
          item._id === post._id
            ? {
                ...item,
                likes: liked
                  ? item.likes.filter((id) => id !== user._id)
                  : [...item.likes, user._id],
              }
            : item
        );

        dispatch(setPosts(updatedPostData));

        toast({
          title: res?.data?.message,
          variant: 'success',
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data?.message,
        variant: 'destructive',
      });
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/posts/${post._id}/comment`,
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

  const bookMarkHandler = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/posts/${post?._id}/bookmark`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsBookMarked((prev) => !prev);
        toast({
          title: res?.data?.message,
          variant: 'success',
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data?.message || 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className=" w-full mx-auto border-none rounded-lg shadow-sm  py- ">
      {/* Header - User Info */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post?.author?.profilePicture} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{post?.author?.username}</p>
              {user?._id === post?.author?._id && (
                <Badge className="h-6 cursor-pointer" variant="secondary">
                  Author
                </Badge>
              )}
            </div>
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
              {post.author._id !== user?._id ? (
                <div className="py-3 font-bold text-red-500 cursor-pointer">
                  Unfollow
                </div>
              ) : (
                ''
              )}

              <div className="py-3 font-semibold cursor-pointer">
                Add to Favorites
              </div>
              {post?.author?._id === user?._id ? (
                <div
                  onClick={deletePostHandler}
                  className="py-3 font-semibold cursor-pointer"
                >
                  Delete
                </div>
              ) : (
                ''
              )}

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
          className="w-full object-cover aspect-[3/4] rounded"
        />
      </CardContent>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-1">
        <div className="flex gap-1 items-center">
          <motion.div
            whileTap={{ scale: 0.8 }}
            initial={{ scale: 1 }}
            animate={{ scale: liked ? 1.2 : 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="cursor-pointer p-1 "
          >
            <Heart
              onClick={() => likeDislikeHandler()}
              className="w-5 h-5 transition-all duration-300 ease-in-out"
              color={liked ? 'red' : 'black'}
              fill={liked ? 'red' : 'none'}
            />
          </motion.div>

          <div className="p-1 rounded-full cursor-pointer">
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="w-6 h-6"
            />
          </div>
          <div className="p-1 rounded-full  cursor-pointer">
            <SendHorizontal className="w-6 h-6 transform rotate-[330deg]" />
          </div>
        </div>
        <div className=" rounded-full hover:bg-gray-100 cursor-pointer">
          <motion.button
            onClick={bookMarkHandler}
            whileTap={{ scale: 0.8 }} // Click bounce effect
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            {isBookMarked ? (
              <BookmarkCheck className="w-6 h-6 text-black" />
            ) : (
              <Bookmark className="w-6 h-6 text-black" /> 
            )}
          </motion.button>
        </div>
      </div>

      {/* Like Count & Caption */}
      <div className="px-3">
        <p className="text-sm font-semibold">{postLike} likes</p>
        <p className="text-sm">
          <span className="font-semibold">{post?.author?.username} </span>
          {post?.caption}
        </p>
      </div>

      <div
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
        className="px-3 py-1 cursor-pointer text-gray-500 text-sm font-semibold"
      >
        View all {post?.comments?.length > 0 ? post?.comments?.length : ' '}{' '}
        Comments
      </div>

      {open && <CommentDilogue open={open} setOpen={setOpen} post={post} />}

      {/* Comment Input */}
      <div className="flex justify-center items-center px-3 py-2 border-t">
        <Input
          placeholder="Add a comment..."
          className="border-none focus-visible:ring-transparent pr-16"
          value={text}
          onChange={changeEentHandler}
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-insta-primary text-sm font-semibold cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </Card>
  );
};

export default Post;
