import { Routes, Route } from "react-router-dom";

import Main from "./pages/Main";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="home/*" element={<Home />} />
    </Routes>
  );
}

export default App;
