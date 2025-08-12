import  { useState } from "react";
import { useDispatch } from "react-redux";
import { addtocart } from "../Feature/slice.jsx";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

export const product = {
  id : 9 ,
  name: "Nike Air Max 2025",
  price: 149.99,
  description:
    "Experience ultimate comfort and sleek design with the latest Nike Air Max 2025. Engineered for performance and style.",
  sizes: ["6", "7", "8", "9", "10", "11"],
  images: [
    "https://www.asics.co.in/media/catalog/product/1/0/1011b974_001_sr_rt_glb-base.jpg?optimize=high&bg-color=255%2C255%2C255&fit=cover&height=375&width=500&auto=webp&format=pjpg", // front
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS76qCk_aFsvo99GdxCQAKqpgsssaLcOijaIg&s", // side
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",    // top
  ],
};
const Nine = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const dispatch = useDispatch();
  const handleAddToCart = (product) => {
    dispatch(addtocart(product));
    toast.success(`${product.name} added successfully`);
  };

  const user = useSelector((state) => state.user.userData);

 const handleLogout = async() => {
      try {
      await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
       dispatch(clearUser())
         navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };


  return (
          <>
      <header className="relative">
          <nav className="mt-5 ml-5 flex  justify-between">
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
    <div className="sm:max-w-6xl mx-auto sm:p-6 p-2.5 grid md:grid-cols-2 gap-10 mt-2">
      <div>
        <img
          src={selectedImage}
          alt="Shoe"
          className="sm:w-[500px] w-[300px] h-[400px] object-cover rounded-xl shadow-md"
        />
        <div className="flex gap-4 mt-4">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Thumbnail"
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                selectedImage === img ? "border-black" : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <h1 className="sm:text-4xl text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-[14px] text-gray-700 font-semibold mb-4">
            ₹{product.price}
          </p>
          <p className="text-gray-600 mb-6 sm:text-[16px] text-[14px] w-[300px] sm:w-full">{product.description}</p>

    
          <div className="mb-6">
            <h3 className="mb-2 font-semibold">Select Size</h3>
            <div className="flex sm:gap-3 gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-2 rounded-md ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "text-gray-800 border-gray-300"
                  } hover:bg-black hover:text-white transition`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
         onClick={()=>handleAddToCart(product)}
          className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition mt-4"
          disabled={!selectedSize}
        >
          {selectedSize ? "Add to Cart" : "Select a Size First"}
        </button>
        
      </div>
    </div> 

    <footer className="bg-black text-gray-200 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">SoleMate</h2>
          <p className="text-sm text-gray-400">
            Step into style with SoleMate – where comfort meets fashion in every step.
          </p>
        </div>

     
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Shop</a></li>
            <li><a href="#" className="hover:text-white">Collections</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

  
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">FAQs</a></li>
            <li><a href="#" className="hover:text-white">Returns</a></li>
            <li><a href="#" className="hover:text-white">Shipping</a></li>
            <li><a href="#" className="hover:text-white">Order Tracking</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaFacebook /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
};

export default Nine;
