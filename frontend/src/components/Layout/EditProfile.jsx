import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { setAuthUser } from '@/Redux/Slices/authSlices';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    username: user?.username,
    bio: user?.bio,
    gender: user?.gender,
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({
        ...prev,
        profilePhoto: URL.createObjectURL(file),
      }));
    }
  };

  const handleInputChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectChangeHandler = (val) => {
    setInput((prev) => ({ ...prev, gender: val }));
  };

  const profileHandler = async () => {
    const formData = new FormData();

    formData.append('username', input.username);
    formData.append('bio', input.bio);
    formData.append('gender', input.gender);

    if (imageRef.current.files[0]) {
      formData.append('profilePhoto', imageRef.current.files[0]);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/users/profile/edits`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res?.data?.user?.bio,
          profilePicture: res?.data?.user?.profilePicture,
          username: res?.data?.user?.username,
          gender: res?.data?.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user._id}`);
        toast({
          title: res?.data?.message,
          variant: 'success',
        });
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.message || 'Something went wrong!',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6 relative bg-gray-100 rounded-xl shadow-sm px-6 py-4">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileInput"
          ref={imageRef}
          onChange={handleImageChange}
        />
        <div className="w-full flex items-center justify-between gap-1">
          <Label
            htmlFor="fileInput"
            className="cursor-pointer flex items-center gap-4"
          >
            <Avatar className="w-20 h-20 hover:opacity-80 transition-opacity ring-2 ring-gray-300">
              <AvatarImage
                src={input.profilePhoto || user.profilePicture}
                alt={user.username}
              />
              <AvatarFallback>
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg">{input.username}</h1>
              <p className="text-sm">{input.bio}</p>
            </div>
          </Label>
          <Button
            onClick={() => imageRef.current.click()}
            className="bg-insta-primary hover:bg-insta-hoverPrimary text-sm rounded-lg shadow"
          >
            Change Photo
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right">Username</Label>
          <Input
            name="username"
            value={input.username}
            onChange={handleInputChange}
            className="col-span-2 focus-visible:ring-transparent"
          />
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right">Bio</Label>
          <Textarea
            name="bio"
            value={input.bio}
            onChange={handleInputChange}
            className="col-span-2 focus-visible:ring-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-3 items-center gap-4">
          <Label className="text-right">Gender</Label>
          <Select
            name="gender"
            value={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="col-span-2 focus-visible:ring-transparent focus:outline-none">
              <SelectValue placeholder="Select a Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem value="Male" className="cursor-pointer">
                  Male
                </SelectItem>
                <SelectItem value="Female" className="cursor-pointer">
                  Female
                </SelectItem>
                <SelectItem value="Others" className="cursor-pointer">
                  Others
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            className={`h-8 ${
              loading
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-insta-primary hover:bg-insta-hoverPrimary'
            }`}
            onClick={profileHandler}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                <span> Please wait...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
