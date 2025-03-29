import { useToast } from '@/hooks/use-toast';
import { setAuthUser } from '@/Redux/Slices/authSlices';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const API_BASE_URL = 'https://instragram-clone-yubw.onrender.com/api/v1';

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      //   console.log(res);

      if (res.status === 200) {
        dispatch(setAuthUser(res.data.user));
        navigate('/');

        toast({
          title: res?.data?.message,
          variant: 'success',
        });

        setFormData({
          email: '',
          password: '',
        });
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

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, []);

  return (
    <div className=" flex w-screen h-screen items-center justify-center">
      <form
        onSubmit={submitHandler}
        className="shadow-lg rounded-lg flex flex-col gap-0.5 p-8 w-[40%]"
      >
        <div className="my-4">
          <h1 className="font-bold text-center text-2xl">LOGO</h1>
          <p className=" text-center text-sm">
            Log in to your account and see photos & videos.
          </p>
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
          className={`bg-insta-primary text-white h-8 hover:bg-insta-hoverPrimar rounded-md mt-4 ${
            loading ? 'cursor-not-allowed  bg-green-500' : ''
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please Wait
            </>
          ) : (
            'Log in'
          )}
        </Button>
        <span className="muted-text text-center mt-2">
          Don't have an account?{' '}
          <Link
            to={'/signup'}
            className="transition-all duration-300 text-blue-600 hover:text-blue-700 font-semibold "
          >
            Register
          </Link>{' '}
        </span>
      </form>
    </div>
  );
};

export default Login;
