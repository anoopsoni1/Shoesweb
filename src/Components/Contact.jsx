import { useState } from "react";
import { FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import { clearUser } from "../Feature/Slicetwo";
import { clearCart } from "../Feature/slice";
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

const user = useSelector((state) => state.user.userData);
 const navigate = useNavigate();
const dispatch = useDispatch()
  const handleLogout = async() => {
      try {
      await axios.post("https://shoesbackend-4.onrender.com/api/v1/user/logout", {}, { withCredentials: true });
        dispatch(clearUser())
         dispatch(clearCart())
         navigate("/login")
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.email || !formData.message) {
        return toast.error("Please fill in all required fields");
      }
      const res = await axios.post("https://shoesbackend-4.onrender.com/api/v1/user/contact", formData);
      toast.success("Message sent successfully");
      setFormData({ name: "", email: "", phone: "", message: "" });
      console.log(res);
      
    } catch (err) {
      toast.error("Something went wrong", err);
    }
  };

  const handletransfer = ()=>{
          navigate("/login")
  }
  return (
    <>
      <SiteHeader onLogout={handleLogout} />
    <div className="h-[94vh] flex flex-col md:flex-row bg-white">
     
      <div className="w-full md:w-1/3 bg-[url('/cona.jpg')] bg-cover p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-black">Contact Info</h2>
          <p className="mb-4 text-black flex items-center gap-2 font-bold">
            <FaPhoneAlt /> +919981872497
          </p>
          <p className="mb-4 flex items-center gap-2 font-bold">
            <FaEnvelope /> support@shoestore.com
          </p>
          <p className="mb-4 flex items-center gap-2 font-bold">
            <FaMapMarkerAlt /> Bhopal, India
          </p>
        </div>
        <div className="flex gap-4 text-xl">
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://wa.me/919981872497" target="_blank" rel="noreferrer">
            <FaWhatsapp />
          </a>
        </div>
      </div>

      <div className="w-full md:w-2/3 p-10">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Get in Touch</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone (optional)"
            className="w-full border border-gray-300 p-3 rounded-md"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message"
            rows="5"
            className="w-full border border-gray-300 p-3 rounded-md"
            required
          ></textarea>
       {user ? ( <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
          >
          Send
          </button>) : (<button
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
            onClick={handletransfer}
          >
          Please Login
          </button>)}   
        </form>
      </div>
    </div>
    </>
  );
};

export default ContactUs;
