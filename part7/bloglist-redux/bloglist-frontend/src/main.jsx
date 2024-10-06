import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import store from "./store";
import "./index.css";
import { Toaster } from "./components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </Router>
);
