import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector ,useDispatch } from "react-redux";
import Page from "./Page";
import { clearUser } from "../Feature/Slicetwo.jsx";

function Home() {
  const user = useSelector((state) => state.user.userData);
   const navigate = useNavigate();
 const dispatch = useDispatch() ;
   const handleLogout = async() => {
      try {
      await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
          dispatch(clearUser())
          console.log("hello");
          navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="bg-[url('/bg.png')] bg-cover bg-center">
      <header className="relative">
        <nav className="mt-2 ml-5 flex justify-between">
          <div>
            <p className="text-2xl font-medium">SoleMate</p>
          </div>

          <div className="sm:block hidden">
            <ul className="flex gap-8 mt-1 font-semibold place-items-center mr-5">
              <li>Featured</li>
              <li>Men</li>
              <li>Women</li>
              <li>Kids</li>
              <li>Accessories</li>
              <li>Sale</li>

              <li className="bg-amber-100 p-3 rounded-[5px]">
                <FaRegHeart />
              </li>
              <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px]">
                <FaShoppingBag />
              </Link>

              {user ? (
                <>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
                <Link to="/dashboard" className="bg-amber-100 p-3 rounded-[5px]">
                  <FaRegUserCircle />
                </Link>
                </>
              ) : (
                <Link to="/dashboard" className="bg-amber-100 p-3 rounded-[5px]">
                  <FaRegUserCircle />
                </Link>
              )}
            </ul>
          </div>

          <div className="flex sm:hidden list-none gap-1">
            <Link className="bg-amber-100 p-3 rounded-[5px]">
              <FaRegHeart />
            </Link>
            <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px]">
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
                Logout
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
