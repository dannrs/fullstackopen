import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllComments } from "../reducers/commentReducer";

const CommentSection = ({ id }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllComments(id));
  }, [dispatch, id]);

  const comments = useSelector((state) => state.comments);

  if (!comments || comments.length === 0) {
    return <p className="text-gray-500 italic">No comments yet.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-800">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
