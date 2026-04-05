import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector ,useDispatch } from "react-redux";
import Page from "./Page";
import { clearUser } from "../Feature/Slicetwo.jsx";
import { HiOutlineLogout } from "react-icons/hi";
import { GiConverseShoe } from "react-icons/gi";
import { BsSubstack } from "react-icons/bs";

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
        <nav className="pt-2 sm:ml-5 ml-1 flex justify-between">
          <div className="flex place-items-center sm:gap-3 gap-1">
            <p className="text-2xl font-medium text-white">SoleMate</p>
                <GiConverseShoe color="white" size={30} />
          </div>

          <div className="sm:block hidden">
            <ul className="flex gap-8 mt-1 font-semibold place-items-center mr-5 text-white">
              
              <li className="bg-amber-100 p-3 rounded-[5px] text-black">
                <FaRegHeart />
              </li>
              {user ? ( <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px] text-black">
                <FaShoppingBag />
              </Link>) : (<Link className="bg-amber-100 p-3 rounded-[5px] text-black" to="/Cart">
                   <FaShoppingBag />
              </Link>)}
             

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
            {user ? ( <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px] text-black">
                <FaShoppingBag />
              </Link>) : (<Link className="bg-amber-100 p-3 rounded-[5px] text-black" to="/Cart">
                   <FaShoppingBag />
              </Link>)}


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
