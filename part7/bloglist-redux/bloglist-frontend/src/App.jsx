import { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUser } from "./reducers/userReducer";
import { Route, Routes, useNavigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import HomePage from "./pages/HomePage";
import UserDetailsPage from "./pages/UserDetailsPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import BlogPage from "./pages/BlogPage";
import NavigationMenu from "./components/NavigationMenu";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  console.log("user from app", user);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedBloglistappUser");
    console.log("loggedUser", loggedUser);
    if (!user && !loggedUser) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializeBlogs());
  }, [dispatch]);

  const showNavigation = user && location.pathname !== "/login";

  return (
    <div className="container mx-auto px-8">
      {showNavigation && <NavigationMenu />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/users/:id" element={<UserDetailsPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blogs/:id" element={<BlogDetailsPage />} />
      </Routes>
    </div>
  );
};

export default App;
