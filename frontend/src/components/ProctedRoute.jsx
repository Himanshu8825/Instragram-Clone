import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]); // Dependency array me user add karna zaroori hai

  return user ? <>{children}</> : null; // Jab tak user nahi milta, tab tak kuch return mat karo
};

export default ProtectedRoute;
