import {
  FaHome,
  FaShoppingCart,
  FaRupeeSign,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { clearUser, setUser } from "../Feature/Slicetwo.jsx";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch user profile
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
  }, [dispatch]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Redirect to login if not logged in
  const handlenav = () => {
    navigate("/login");
  };

  const user = useSelector((state) => state.user.userData);

  return (
    <div className="">
      {user ? (
        <div className="min-h-screen flex justify-between bg-gradient-to-br from-orange-100 to-purple-100 p-6">
          <aside className="w-[40vh] bg-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.user}`}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border-2 border-purple-500 object-cover"
                />
                <div>
                  <h2 className="font-bold">
                    {user.FirstName} {user.LastName}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <nav className="mt-4">
                <ul className="grid gap-6 font-bold">
                  <Link to="/" className="hover:text-yellow-500">1. Home</Link>
                  <Link to="/cart" className="hover:text-yellow-500">2. Cart</Link>
                  <Link to="/cart" className="hover:text-yellow-500">3. Orders</Link>
                  <Link to="/contact" className="hover:text-yellow-500">4. Contact</Link>
                  <Link to="/setting" className="hover:text-yellow-500">5. Setting</Link>
                </ul>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 mt-6 hover:text-red-700"
            >
              <FaSignOutAlt /> Logout
            </button>
          </aside>
        </div>
      ) : (
        <div className="grid gap-2 place-items-center min-h-screen">
          <h1 className="text-xl font-bold">Please Login</h1>
          <button
            onClick={handlenav}
            className="border-2 px-4 py-2 bg-black text-amber-50 rounded-lg hover:bg-gray-800"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
