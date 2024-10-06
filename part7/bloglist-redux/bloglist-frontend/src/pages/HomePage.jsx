import BlogList from "../components/BlogList";
import BlogDialog from "@/components/BlogDialog";

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="my-6 ">
        <BlogDialog />
      </div>
      <div className="my-6">
        <BlogList />
      </div>
    </div>
  );
};

export default HomePage;
