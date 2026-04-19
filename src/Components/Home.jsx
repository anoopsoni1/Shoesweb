import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Page from "./Page";
import { clearUser } from "../Feature/Slicetwo.jsx";
import { GiConverseShoe } from "react-icons/gi";
import SiteHeader from "./SiteHeader.jsx";

const API_USER = "https://shoesbackend-4.onrender.com/api/v1/user";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(clearUser());
    try {
      await axios.post(`${API_USER}/logout`, {}, { withCredentials: true });
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-[url('/imagesss.png')]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-zinc-950"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <SiteHeader
          tone="onImage"
          onLogout={handleLogout}
          brandAddon={
            <GiConverseShoe
              className="h-7 w-7 shrink-0 text-white drop-shadow sm:h-8 sm:w-8"
              aria-hidden
            />
          }
        />
        <Page />
      </div>
    </div>
  );
}

export default Home;
