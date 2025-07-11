import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Home";
import { AppContext } from "./context/AppContext";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppContext>
    <Home />
  </AppContext>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
