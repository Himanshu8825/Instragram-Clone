import { Post } from '@/Index';

const Posts = () => {
  return (
    <div>
      {' '}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
        <Post key={index} />
      ))}{' '}
    </div>
  );
};

export default Posts;
