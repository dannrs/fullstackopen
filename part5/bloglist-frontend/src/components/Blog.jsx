import { useState } from "react";

const Blog = ({ user, blog, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false);
  console.log("user:", user);
  console.log("blog:", blog);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const blogToUpdate = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    };
    updateBlog(blogToUpdate);
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog);
    }
  };

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            <span data-testid="like-count">{blog.likes}</span>
            <button onClick={handleLike}>likes</button>
          </div>
          <div>{blog.author}</div>
          {user.username === blog.user.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
