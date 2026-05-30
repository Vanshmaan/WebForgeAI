import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import Generate from "./pages/Generate";
import WebsiteEditor from "./pages/websiteEditor";
import LiveSite from "./pages/LiveSite";
import Pricing from "./pages/Pricing";

export const serverUrl = "https://webforgeai-134.onrender.com";

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

      <Route
        path="/site/:slug"
        element = {<LiveSite/>}
        />

        <Route
        path="/pricing"
        element = {<Pricing/>}
        />
    



    </Routes>
  );
};

export default App;
