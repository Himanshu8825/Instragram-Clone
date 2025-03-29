import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { useEffect, useState } from 'react';

const AllUsers = () => {
  const API_BASE_URL = 'https://instragram-clone-yubw.onrender.com/api/v1';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/all`);
        setUsers(response?.data?.users); // Fixing the data extraction

        // console.log("Data For All USers ",response);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-4  justify-start">
        {users?.map((user) => (
          <div key={user?._id} className="flex flex-col items-center">
            <Avatar className="w-16 h-16 cursor-pointer">
              <AvatarImage
                src={user?.profilePicture || "https://via.placeholder.com/150"}
                alt={user?.username}
                className="w-full h-full object-cover rounded-full border "
              />
              <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <p className="mt-2 text-sm text-black">{user?.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
