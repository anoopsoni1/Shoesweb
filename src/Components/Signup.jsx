import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    email: '',
    password: '',
  });

  const handle = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        alert('Registered successfully!');
      } else {
        alert(`${data.message}`);
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create Account 👟</h2>
        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
            <input
              name="FirstName"
              value={formData.FirstName}
              onChange={handle}
              type="text"
              placeholder="Anoop"
              autoComplete="given-name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
            <input
              name="LastName"
              value={formData.LastName}
              onChange={handle}
              type="text"
              placeholder="Soni"
              autoComplete="family-name"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handle}
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
              onChange={handle}
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-start space-x-2 text-sm">
            <input type="checkbox" className="mt-1" required />
            <p>
              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?
          <Link to="/login" className="text-blue-600 font-medium hover:underline ml-1">Log in</Link>
        </p>
        <Link to="/" className='text-white p-1.5 rounded-2xl mt-3.5 text-[14px] grid font-bold bg-blue-600 text-center'>Home</Link>
      </div>
    </div>
  );
}
