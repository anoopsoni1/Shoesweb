import { Link } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function SignupPage() {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handle = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        alert("🎉 Registered successfully!");
      } else {
        alert(`${data.message}`);
      }
    } catch (err) {
      alert("⚠️ Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://png.pngtree.com/background/20230613/original/pngtree-many-pairs-of-shoes-in-front-of-a-wall-picture-image_3382136.jpg')] bg-cover bg-center relative px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-blue-900/40 to-black/60"></div>

     
      <div className="relative sm:w-full w-[50vh] max-w-md bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Your Account 
        </h2>

        <form className="space-y-5" onSubmit={handleRegister}>
     
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              First Name
            </label>
            <input
              name="FirstName"
              value={formData.FirstName}
              onChange={handle}
              type="text"
              placeholder="John"
              autoComplete="given-name"
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

        
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Last Name
            </label>
            <input
              name="LastName"
              value={formData.LastName}
              onChange={handle}
              type="text"
              placeholder="Doe"
              autoComplete="family-name"
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

     
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handle}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={handle}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl bg-white/80 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute right-4 top-4 cursor-pointer text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                   {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-sm text-white">
            <input type="checkbox" className="mt-1" required />
            <p>
              I agree to the{" "}
              <a href="#" className="text-yellow-300 hover:underline">
                Terms & Conditions
              </a>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-white mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-yellow-300 font-medium hover:underline ml-1"
          >
            Log in
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
