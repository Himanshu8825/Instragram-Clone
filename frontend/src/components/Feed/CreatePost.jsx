import { useToast } from '@/hooks/use-toast';
import { setPosts } from '@/Redux/Slices/postSlice';
import { readFileAsDataURL } from '@/utils/constan';
import axios from 'axios';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { Textarea } from '../ui/textarea';

const CreatePost = ({ open, setOpen }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { posts } = useSelector((state) => state.post);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append('caption', caption);
    if (imagePreview) formData.append('image', file);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/posts/addpost`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
    //   console.log(res);
      if (res.status === 201) {
        dispatch(setPosts([res.data.post, ...posts]));

        toast({
          title: res?.data?.message,
          variant: 'success',
        });
        setOpen(false);
        setFile(null);
        setImagePreview(null);
        setCaption('');
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast({
        title: error?.response?.data?.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-lg w-full p-4 rounded-lg shadow-lg bg-white"
        onInteractOutside={() => setOpen(false)}
      >
        {/* Header */}
        <DialogHeader className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Create new post</h2>
        </DialogHeader>

        {/* Image Upload Section */}
        <div className="w-full flex flex-col items-center gap-3">
          {imagePreview ? (
            <div className="relative w-full">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="w-full max-h-[400px] object-cover object-top  rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                onClick={() => {
                  setFile(null);
                  setImagePreview(null);
                }}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <label className="w-full h-64 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
              <ImagePlus className="w-10 h-10 text-gray-500" />
              <span className="text-sm text-gray-500">Click to upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={fileChangeHandler}
              />
            </label>
          )}
        </div>

        {/* Caption Input */}
        <Textarea
          placeholder="Write a caption..."
          className="w-full focus-visible:ring-transparent p-2 border border-gray-300 rounded-lg"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Post Button */}
        {imagePreview && (
          <Button
            className={`w-full bg-insta-primary hover:bg-insta-hoverPrimar text-white font-semibold py-2 rounded-lg transition ${
              loading ? 'cursor-not-allowed bg-green-500' : ''
            }`}
            onClick={createPostHandler}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please Wait
              </>
            ) : (
              'Post'
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
