import { useState } from "react";
import { useDispatch } from "react-redux";
import BlogForm from "../components/BlogForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createBlog } from "../reducers/blogReducer";
import { toast } from "sonner";

const BlogDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();

  const handleDialogClose = () => {
    setOpen(false);
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const blogObject = { title, author, url };

    try {
      await dispatch(createBlog(blogObject)).unwrap();
      toast.success(
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      );
      handleDialogClose();
    } catch (error) {
      toast.error("Failed to add new blog post");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-3.5 h-3.5 mr-2" /> New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
          <DialogDescription>Add a new post</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-4">
            <BlogForm
              title={title}
              author={author}
              url={url}
              onTitleChange={(e) => setTitle(e.target.value)}
              onAuthorChange={(e) => setAuthor(e.target.value)}
              onUrlChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDialog;
