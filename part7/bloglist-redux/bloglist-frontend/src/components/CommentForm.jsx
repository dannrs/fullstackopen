import { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { createComment } from "@/reducers/commentReducer";

const CommentForm = ({ id }) => {
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await dispatch(createComment({ id, content: comment })).unwrap();
      toast.success(`a new comment added`);
      setComment("");
    } catch (error) {
      toast.error("Failed to add new comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="comment" className="text-sm font-medium text-gray-700">
          Add a comment
        </Label>
        <div className="flex sm:flex-row flex-col items-start sm:items-center gap-4">
          <Input
            id="comment"
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            placeholder="Write your comment here"
            className="w-full"
          />
          <Button type="submit" size="sm">
            Comment
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
