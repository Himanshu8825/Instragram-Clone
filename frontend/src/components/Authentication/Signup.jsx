import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const { toast } = useToast();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/users/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.status === 201) {
        navigate('/login');
        toast({
          title: res.data.message,
          variant: 'success',
        });

        setFormData({
          username: '',
          email: '',
          password: '',
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast({
        title: error.response.data.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex w-screen h-screen items-center justify-center">
      <form
        onSubmit={submitHandler}
        className="shadow-lg rounded-lg flex flex-col gap-0.5 p-8 w-[40%]"
      >
        <div className="my-4">
          <h1 className="font-bold text-center text-2xl">LOGO</h1>
          <p className=" text-center text-sm">
            {' '}
            Sign Up to create an account and see photos & videos.
          </p>
        </div>
        <div>
          <Label className="font-medium">Username</Label>
          <Input
            className="focus-visible:ring-transparent  my-1"
            placeholder="Enter your username"
            type="text"
            name="username"
            value={formData.username}
            onChange={changeHandler}
          />
        </div>
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            className="focus-visible:ring-transparent  my-1"
            placeholder="Enter your E-mail Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
          />
        </div>
        <div>
          <Label className="font-medium">Password</Label>
          <Input
            className="focus-visible:ring-transparent  my-1"
            placeholder="Enter your Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
          />
        </div>
        <Button
          type="submit"
          className={`bg-insta-primary text-white hover:bg-insta-hover  h-8 hover:bg-insta-hoverPrimar rounded-md mt-4 ${
            loading ? 'cursor-not-allowed  bg-green-500' : ''
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please Wait
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
        <span className="muted-text text-center mt-2">
          Already have an account?{' '}
          <Link
            to={'/login'}
            className=" text-blue-600 hover:text-blue-700 font-semibold"
          >
            Login
          </Link>{' '}
        </span>
      </form>
    </div>
  );
};

export default Signup;
