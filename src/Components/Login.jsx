import React, { useEffect, useState } from 'react';
import {  Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../Feature/Slicetwo.jsx";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
          email: '',
          password: ''
  });
const navdata = useNavigate()

const dispatch = useDispatch();

  const handleChange = (e) => {
        setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

let userid ;
const handleLogin =  async(e) => {
  e.preventDefault();
  const { email, password } = formData;

  try {
    const res = await fetch("http://localhost:5000/api/v1/user/login", {
      method: "POST",
      credentials : "include" ,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });      

    const data = await res.json();
   dispatch(setUser(data.data.user)); 
        const id  = data.data.user._id ;
           userid = {id : id}
    if (res.ok) {
      setMessage("Login Successful");
          alert("Login Successful");
             Getcart() ;
             navdata("/dashboard");
    } else {
      setMessage(data.message || "Login failed");
      alert(data.message || "Login failed");
    }
  } catch (err) {
         console.error(err);
    setMessage("Something went wrong");
    alert(`Login Failed: ${err.message}`);
  }
};

const Getcart  = async()=>{
    const res = await fetch(`http://localhost:5000/api/v1/user/getcart/${userid.id}`, {
      method: "GET",
      credentials : "include" ,
      headers: {
        "Content-Type": "application/json",
      },
    })
     const dat = await res.json();
       console.log(dat);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back 👟</h2>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="text-sm text-center mt-4 font-medium text-gray-700">{message}</p>
        )}

        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?
          <Link to="/SignIn" className="text-blue-600 font-medium hover:underline ml-1">Sign up</Link>
        </p>
        <Link to="/" className="text-white p-1.5 rounded-2xl mt-3.5 text-[14px] grid font-bold bg-blue-600 text-center">
          Home
        </Link>
      </div>
    </div>
  );
}
