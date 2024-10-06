import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateBlog } from "../reducers/blogReducer";
import CommentSection from "../components/CommentSection";
import CommentForm from "../components/CommentForm";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";

const BlogDetailsPage = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  const id = useParams().id;
  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) return null;

  const handleLike = async () => {
    try {
      dispatch(updateBlog(blog));
      toast.success(`You liked "${blog.title}"`);
    } catch (error) {
      toast.error(`Error liking the blog: ${error.message}`, true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-semibold text-2xl mb-2">{blog.title}</h2>
        <div className="text-sm text-gray-600 flex gap-4">
          <span>by {blog.author}</span>
          <span>added by {blog.user.name}</span>
        </div>
      </div>
      <a
        href={blog.url}
        className="text-blue-600 hover:underline mb-8 block"
        target="_blank"
        rel="noopener noreferrer"
      >
        {blog.url}
      </a>
      <Button onClick={handleLike} size="sm" className="mb-8">
        <ThumbsUp className="h-3.5 w-3.5 mr-2" /> {blog.likes}
      </Button>
      <h2 className="font-semibold text-xl mb-4">Comments</h2>
      <div className="mb-6">
        <CommentForm id={blog.id} />
      </div>
      <CommentSection id={blog.id} />
    </div>
  );
};

export default BlogDetailsPage;
