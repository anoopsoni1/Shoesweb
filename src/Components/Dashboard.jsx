import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaPhoneAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { clearUser, setUser } from "../Feature/Slicetwo.jsx";
import {motion , AnimatePresence } from "framer-motion";
import { clearCart } from "../Feature/slice.jsx";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://shoesbackend-4.onrender.com/api/v1/user/profile", {
          withCredentials: true,
        });
        dispatch(setUser(res.data.user));
      } catch (errr) {
        console.log(errr);
      }
    };
    fetchUser();
  }, [dispatch]);


  const handleLogout = async () => {
    try {
      await axios.post(
        "https://shoesbackend-4.onrender.com/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      dispatch(clearUser());
       dispatch(clearCart())
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handlenav = () => navigate("/login");

  const navItems = [
    { label: "Home", icon: <FaHome />, path: "/" },
    { label: "Cart", icon: <FaShoppingCart />, path: "/cart/:UserId" },
    { label: "Orders", icon: <FaBoxOpen />, path: "/orders" },
    { label: "Contact", icon: <FaPhoneAlt />, path: "/contact" },
    { label: "Settings", icon: <FaCog />, path: "/setting" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 relative">
      {user ? (
        <>
          <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between bg-white/60 backdrop-blur-lg px-4 py-3 shadow-md z-20">
            <h1 className="text-lg font-bold text-purple-700">Dashboard</h1>
            <button onClick={() => setSidebarOpen(true)}>
              <FaBars size={22} className="text-gray-700" />
            </button>
          </div>

          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 768) && (
              <>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black z-30 md:hidden"
                  />
                )}
                <motion.aside
                  initial={{ x: -250 }}
                  animate={{ x: 0 }}
                  exit={{ x: -250 }}
                  transition={{ duration: 0.4 }}
                  className="fixed md:relative top-0 left-0 h-full md:h-auto w-[260px] bg-white/100 backdrop-blur-lg shadow-xl rounded-r-3xl p-6 flex flex-col justify-between border border-white/40 z-40"
                >
                  <div className="md:hidden flex justify-end">
                    <button onClick={() => setSidebarOpen(false)}>
                      <FaTimes size={22} className="text-gray-700" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <img
                        src={`https://picsum.photos/seed/picsum/200/300`}
                        alt="User Avatar"
                        className="w-16 h-16 rounded-full border-2 border-purple-500 shadow-md"
                      />
                      <div>
                        <h2 className="font-bold text-lg text-gray-800">
                          {user.FirstName} {user.LastName}
                        </h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <nav>
                      <ul className="grid gap-4 font-semibold">
                        {navItems.map((item, i) => (
                          <motion.li
                            key={i}
                            whileHover={{ scale: 1.05, x: 6 }}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-100 transition"
                          >
                            {item.icon}
                            <Link to={item.path}>{item.label}</Link>
                          </motion.li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-lg hover:opacity-90 transition mt-6"
                  >
                    <FaSignOutAlt /> Logout
                  </motion.button>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
          <div className="flex-1 md:ml-[260px] p-6 mt-12 md:mt-0">
            <h1 className="text-2xl font-bold text-gray-700">
              Welcome, {user.FirstName}
            </h1>
            <p className="mt-3 text-gray-600">
              This is your personalized dashboard. You can add main content
              here (products, charts, etc.).
            </p>
          </div>
        </>
      ) : (
        <div className="grid gap-3 place-items-center w-full h-[40vh]">
          <h1 className="text-2xl font-bold text-gray-700"> Please Login</h1>
          <button
            onClick={handlenav}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
