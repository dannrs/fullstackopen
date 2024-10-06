import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const UserDetailsPage = () => {
  const users = useSelector((state) => state.users);

  const id = useParams().id;
  const user = users.find((user) => user.id === id);
  console.log(user);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="mb-8 font-semibold text-2xl">{user.username}</h2>
      <h3 className="font-semibold text-xl mb-4">Blogs</h3>
      <div className="space-y-4">
        {user.blogs.map((blog) => (
          <div key={blog.id}>
            <Link
              to={`/blogs/${blog.id}`}
              className="text-blue-600 hover:underline block"
            >
              {blog.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetailsPage;
