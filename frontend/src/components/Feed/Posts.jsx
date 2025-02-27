import { Post } from '@/Index';
import { useSelector } from 'react-redux';

const Posts = () => {
  const { posts } = useSelector((state) => state.post);



  return (
    <div className="w-[60%]">
      {posts?.map((post) => (
        <Post key={post._id} post={post}  />
      ))}{' '}
    </div>
  );
};

export default Posts;
