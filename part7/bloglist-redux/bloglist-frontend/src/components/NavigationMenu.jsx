import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../reducers/userReducer";
import { Button } from "./ui/button";

const NavigationMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="max-w-4xl mx-auto flex h-12 items-center justify-between my-4">
      <div>
        <span className="pr-8 font-semibold text-xl">Bloglist</span>
        <span className="space-x-4">
          <Link to="/" className="">
            Home{" "}
          </Link>
          <Link to="/blogs">Blogs </Link>
          <Link to="/users">Users </Link>
        </span>
      </div>
      <div>
        {user && (
          <span>
            <Button onClick={handleLogout} size="sm">
              Logout
            </Button>
          </span>
        )}
      </div>
    </nav>
  );
};

export default NavigationMenu;
