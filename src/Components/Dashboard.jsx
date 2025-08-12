import {
  FaShoePrints,
  FaHome,
  FaShoppingCart,
  FaRupeeSign,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector ,useDispatch} from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { clearUser ,setUser } from "../Feature/Slicetwo.jsx";

const Dashboard = () => {
 const dispatch = useDispatch()
const navigate = useNavigate(); 

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/user/profile", {
        withCredentials: true,
      });
      dispatch(setUser(res.data.user));
    } catch (err) {
       dispatch(clearUser());
    }
  };
  fetchUser();
}, []);

const handleLogout = async() => {
      try {
      await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
             dispatch(clearUser())
            console.log("hello");
             navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
 
  const handlenav = ()=>{
    navigate("/login")
  }

 const user = useSelector((state) => state.user.userData);

  return (
    <div className="min-h-screen flex">
      <aside className="sm:w-64 w-[360px] shadow-md p-6 grid place-items-center">
        <h1 className="text-3xl font-bold text-gray-800 sm:mb-8">
         {  user ? (<h1>{user?.FirstName}{user?.LastName}</h1>):(
          <>
          <div className="grid gap-2 place-items-center">
          <h1>Please Login </h1>
          <button onClick={handlenav} className="border-2 px-2 bg-black text-amber-50">Login</button>
          </div>
           </>
          ) }</h1>
        <nav className="gap-6 grid text-gray-700">
        <Link to="/" ><NavItem icon={<FaHome />} label="Home" /></Link> 
        <Link to="/list"> <NavItem icon={<FaShoePrints />} label="Products" /></Link>  
        <Link> <NavItem icon={<FaShoppingCart />} label="Orders" /> </Link> 
        <Link onClick={handleLogout}><NavItem icon={<FaSignOutAlt />} label="Logout" /></Link>  
        </nav>
      </aside>

    
      <main className="flex-1 ">
        <header className="mb-8 sm:block hidden">
          <h2 className="text-3xl font-semibold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-500">Manage your products, orders and more.</p>
        </header>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center space-x-3 cursor-pointer hover:text-black transition">
    {icon}
    <span>{label}</span>
  </div>
);


export default Dashboard;
