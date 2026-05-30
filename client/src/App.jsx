import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import Generate from "./pages/Generate";
import WebsiteEditor from "./pages/websiteEditor";

export const serverUrl = "http://localhost:8000";

const App = () => {
  useGetCurrentUser();

  const { userData } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/dashboard"
        element={userData ? <Dashboard /> : <Home/>}
      />

       <Route
        path="/generate"
        element={userData ? <Generate /> : <Home />}
      />

      
       <Route
        path="/editor/:id"
        element={userData ? <WebsiteEditor /> : <Home />}
      />



    </Routes>
  );
};

export default App;