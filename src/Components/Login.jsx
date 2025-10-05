import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../Feature/Slicetwo.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
 
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navdata = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
   
    e.preventDefault();
    const { email, password } = formData;

    try {
      setLoading(true);
      const res = await fetch("https://shoesbackend-2-xrez.onrender.com/api/v1/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
     
      if (res.ok) {
        dispatch(setUser(data.data.user));
        setMessage(" Login Successful");
          navdata("/dashboard");
     
      } else {
        setMessage(data.message || " Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage(` Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  const Getcart = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/user/getcart/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const dat = await res.json();
      console.log("User Cart:", dat);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://png.pngtree.com/background/20230613/original/pngtree-many-pairs-of-shoes-in-front-of-a-wall-picture-image_3382136.jpg')] bg-cover  px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 
        </h2>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 shadow focus:outline-none focus:ring-2 focus:ring-gray-800"
                required
              />
              <span
                className="absolute right-4 top-4 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-white">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-purple-600"
              />
              <span>Remember me</span>
            </label>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {message && (
          <p className="text-sm text-center mt-4 font-medium text-white">
            {message}
          </p>
        )}

        <p className="text-sm text-center text-white mt-6">
          Don’t have an account?
          <Link
            to="/SignIn"
            className="text-yellow-300 font-medium hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>
        <Link
          to="/"
          className="text-white p-2 rounded-xl mt-4 block text-[14px] font-bold bg-blue-600 text-center hover:bg-blue-700 transition"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
