import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

const AllUsers = () => {
  const API_BASE_URL = 'https://instragram-clone-yubw.onrender.com/api/v1';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/all`);
        setUsers(response?.data?.users); // Fixing the data extraction

        console.log("Data For All USers ",response?.data?.users);

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
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>
      <div className="grid grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user?._id} className="flex flex-col items-center p-4 shadow-md rounded-xl">
            <Avatar className="w-20 h-20">
              <img
                src={user?.profilePicture || 'https://via.placeholder.com/150'}
                alt={user?.username}
                className="w-full h-full object-cover rounded-full"
              />
            </Avatar>
            <p className="mt-2 font-semibold">{user?.username}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
