import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
export const serverUrl = "http://localhost:8000";

const App = () => {
  useGetCurrentUser(); 
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default App;