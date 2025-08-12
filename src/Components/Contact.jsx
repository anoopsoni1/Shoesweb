import { useState } from "react";
import { FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch , useSelector } from "react-redux";
import { useNavigate , Link} from "react-router-dom";
import { clearUser } from "../Feature/Slicetwo";
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
      await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
        dispatch(clearUser())
         navigate("/login");
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

      const res = await axios.post("http://localhost:5000/api/v1/user/contact", formData);
      toast.success("Message sent successfully");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handletransfer = ()=>{
          navigate("/login")
  }
  return (
    <>
    <header className="relative" >
          <nav className=" ml-5 flex  justify-between">
            <div>
              <Link to="/" className="text-2xl font-medium">SoleMate</Link>
            </div>
  
            <div className="sm:block hidden">
              <ul className="flex gap-8 mt-1 font-semibold place-items-center mr-5">
  
                <Link to="/" className="bg-amber-100 p-3 rounded-[5px]">
                  <FaRegHeart />
                </Link>
                <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px]">
                  <FaShoppingBag />
                </Link>
  
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to="/dashboard" className="bg-amber-100 p-3 rounded-[5px]">
                    <FaRegUserCircle />
                  </Link>
                )}
              </ul>
            </div>
  
            <div className="flex sm:hidden list-none gap-1">
              <Link className="bg-amber-100 p-3 rounded-[5px]">
                <FaRegHeart />
              </Link>
              <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px]">
                <FaShoppingBag />
              </Link>
  
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="bg-amber-100 p-3 rounded-[5px]">
                  <FaRegUserCircle />
                </Link>
              )}
            </div>
          </nav>
        </header>
    <div className="h-[94vh] flex flex-col md:flex-row bg-gray-50">
     
      <div className="w-full md:w-1/3 bg-black text-white p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-6">Contact Info</h2>
          <p className="mb-4 flex items-center gap-2">
            <FaPhoneAlt /> +917748801549
          </p>
          <p className="mb-4 flex items-center gap-2">
            <FaEnvelope /> support@shoestore.com
          </p>
          <p className="mb-4 flex items-center gap-2">
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
