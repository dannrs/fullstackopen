import { Label } from "./ui/label";
import { Input } from "./ui/input";

const BlogForm = ({
  title,
  author,
  url,
  onTitleChange,
  onAuthorChange,
  onUrlChange,
}) => {
  return (
    <form className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          name="title"
          data-testid="title"
          value={title}
          onChange={onTitleChange}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          type="text"
          name="author"
          data-testid="author"
          value={author}
          onChange={onAuthorChange}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="url">Url</Label>
        <Input
          id="url"
          type="text"
          name="url"
          data-testid="url"
          value={url}
          onChange={onUrlChange}
        />
      </div>
    </form>
  );
};

export default BlogForm;
