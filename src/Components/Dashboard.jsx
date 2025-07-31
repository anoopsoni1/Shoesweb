import axios from "axios";
import { useLocation } from "react-router-dom";
export default function Dashboard() {
const location = useLocation();
 const user = location.state ;
 
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
         
      window.location.href = "/login" ;
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">Welcome, {user?.FirstName}</h2>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
