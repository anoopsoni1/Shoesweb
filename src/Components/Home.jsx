import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector ,useDispatch } from "react-redux";
import Page from "./Page";
import { clearUser } from "../Feature/Slicetwo.jsx";
import InstallPrompt from "./Installprompt.jsx";
import { HiOutlineLogout } from "react-icons/hi";

function Home() {
  const user = useSelector((state) => state.user.userData);
   const navigate = useNavigate();
 const dispatch = useDispatch() ;
   
 const handleLogout = async() => {
        dispatch(clearUser())
      try {
      await axios.post("https://shoesbackend-4.onrender.com/api/v1/user/logout", {}, { withCredentials: true })
          dispatch(clearUser())
          navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="bg-[url('/imagesss.png')] bg-cover bg-center">
      <header className="relative">
        <nav className="pt-2 ml-5 flex justify-between">
          <div>
            <p className="text-2xl font-medium text-white">SoleMate</p>
            <InstallPrompt />
          </div>

          <div className="sm:block hidden">
            <ul className="flex gap-8 mt-1 font-semibold place-items-center mr-5 text-white">
              
              <li className="bg-amber-100 p-3 rounded-[5px] text-black">
                <FaRegHeart />
              </li>
              <Link to="/cart/:UserId" className="bg-amber-100 p-3 rounded-[5px] text-black">
                <FaShoppingBag />
              </Link>

              {user ? (
                <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                 <HiOutlineLogout size={21} />
                </button>
                <Link to="/dashboard" className="bg-amber-100 p-3 rounded-[5px] text-black">
                  <FaRegUserCircle />
                </Link>
                </>
              ) : (
                <Link to="/login" className="bg-amber-100 p-3 rounded-[5px] text-black">
                  <FaRegUserCircle />
                </Link>
              )}
            </ul>
          </div>

          <div className="flex sm:hidden list-none gap-1">
            <Link className="bg-amber-100 p-3 rounded-[5px]">
              <FaRegHeart />
            </Link>
            <Link to="/cart/:UserId" className="bg-amber-100 p-3 rounded-[5px]">
              <FaShoppingBag />
            </Link>

            {user ? (
              <>
              <Link to="/dashboard" className="bg-amber-100 p-3 rounded-[5px]">
                <FaRegUserCircle />
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-[10px]"
              >
                <HiOutlineLogout />
              </button>
              
              </>
            ) : (
              <Link to="/dashboard" className="bg-amber-100 p-3 rounded-[5px]">
                <FaRegUserCircle />
              </Link>
            )}
          </div>
        </nav>
      </header>

      <Page />
    </div>
  );
}

export default Home;
