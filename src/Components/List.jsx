import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch , useSelector } from "react-redux";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { addtocart } from "../Feature/slice";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { clearUser  } from "../Feature/Slicetwo";
 
 
const products = [
  {
    id: 1,
    name: "Nike Air Max",
    price: 14999,
    image: "./List01.jpg",
  },
  {
    id: 2,
    name: "Adidas Ultraboost",
    price: 12999,
    image: "./List02.jpeg",
  },
  {
    id: 3,
    name: "Puma RS-X",
    price: 9999,
    image: "./List03.jpg",
  },
  {
    id: 4,
    name: "Reebok Classic",
    price: 7999,
    image: "./List04.jpg",
  },
  {
    id: 5,
    name: "Jordan 1 Retro",
    price: 17999,
    image: "./List05.jpeg",
  },
  {
    id: 6,
    name: "New Balance 574",
    price: 8999,
    image: "./List06.jpeg",
  },
   {
    id: 7,
    name: "New Balance 574",
    price: 8999,
    image: "./List07.jpg",
  },
   {
    id: 8,
    name: "New Balance 574",
    price: 8999,
    image: "./List08.jpg",
  },
   {
    id: 9,
    name: "New Balance 574",
    price: 8999,
    image: "./List09.jpg",
  },
   {
    id: 10,
    name: "New Balance 574",
    price: 8999,
    image: "./List10.jpg",
  },
   {
    id: 11,
    name: "New Balance 574",
    price: 8999,
    image: "./List11.jpeg",
  },
   {
    id: 12,
    name: "New Balance 574",
    price: 8999,
    image: "./List12.jpg",
  },
   {
    id: 13,
    name: "New Balance 574",
    price: 8999,
    image: "./List13.jpg",
  },
   {
    id: 14,
    name: "New Balance 574",
    price: 8999,
    image: "./List14.jpeg",
  },
   {
    id: 15,
    name: "New Balance 574",
    price: 8999,
    image: "./List15.jpg",
  },
   {
    id: 16,
    name: "New Balance 574",
    price: 8999,
    image: "./List16.jpg",
  },
   {
    id: 17,
    name: "New Balance 574",
    price: 8999,
    image: "./List17.jpg",
  },
   {
    id: 18,
    name: "New Balance 574",
    price: 8999,
    image: "./List18.jpeg",
    category : "Sneaker"
  },
];
const List = () => {
   const dispatch = useDispatch();
const user = useSelector((state) => state.user.userData);
 const navigate = useNavigate();

  const handleLogout = async() => {
      try {
      await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
         dispatch(clearUser())
         navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleAddToCart = (product) => {
       dispatch(addtocart(product));
     toast.success(`${product.name} added successfully`);
  };
   

 const bigger = (e)=>{
   if(e===1){
    window.location.href = "/one"
   } 
   else if(e===2){
    window.location.href = "/two"
   }
   else if(e===3){
    window.location.href = "/three"
   }
   else if(e===4){
    window.location.href = "/four"
   }
   else if(e===5){
    window.location.href = "/five"
   }
   else if(e===6){
    window.location.href = "/six"
   }
   else if(e===7){
    window.location.href = "/seven"
   }
   else if(e===8){
    window.location.href = "/eight"
   }
   else if(e===9){
    window.location.href = "/nine"
   }
   else if(e===10){
    window.location.href = "/ten"
   }
   else if(e===11){
    window.location.href = "/eleven"
   }
   else if(e===12){
    window.location.href = "/twelve"
   }
   else if(e===13){
    window.location.href = "/thirteen"
   }
   else if(e===14){
    window.location.href = "/fourteen"
   }
   else if(e===15){
    window.location.href = "/fifteen"
   }
    else if(e===16){
    window.location.href = "/sixteen"
   }
    else if(e===17){
    window.location.href = "/seventeen"
   }
    else if(e===18){
    window.location.href = "/eighteen"
   }
    else if(e===19){
    window.location.href = "/nineteen"
   }
    else if(e===20){
    window.location.href = "/twenty"
   }
    else if(e===21){
    window.location.href = "/twentyone"
   }

 }
  const[category , setcategory] = useState("All") 

   const categories = [
    "All",
    "Sneaker",
    "Sportswear",
    "Dress Shoes",
    "Casual Shoes",
    "Boots",
    "Sandals",
    "Women’s Shoes",
    "Slippers",
    "Kids'Shoes",
    "Seasonal Shoes",
    "Traditional Footwear",
    "Adventure Shoes",
    "Women's High Heels"
  ];

    const filteredProducts = products.filter(product => {
    const matchesCategory = category === "All" || product.category === category 
    return  matchesCategory;
  });

   const handlelikes = ()=>{
       const likes = document.getElementById("one")
   }
  
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
     <div className="flex ">
      <div className="sm:block hidden">
    <aside className="w-32 sticky top-4 h-fit bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((cat, index) => (
            <li key={index} >
              <button 
                onClick={() => setcategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  category === cat ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      </div>
    <div className="max-w-8xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600 mb-3">₹{product.price}</p>
              <div className="flex gap-2">
                <button onClick={()=>handleAddToCart(product)} className="flex-1 bg-black text-white py-2 rounded-md hover:bg-gray-800">
                  Add to Cart
                </button>
                <button onClick={()=>bigger(product.id)} className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-100">
                  View
                </button>
                <button id="one" onClick={handlelikes}><FaRegHeart /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
<div className="mt-14 ">
  <ul className="flex gap-12 justify-center">
    <NavLink to="/list1" className={(isActive)=>
      ` text-white text-2xl p-2 rounded-b-full
      ${isActive ? "bg-amber-400" : "bg-black" }`
    }>1</NavLink>
     <NavLink to="/list2" className={(isActive)=>
      ` text-white text-2xl p-2 rounded-b-full
      ${isActive ? "bg-amber-400" : "bg-black" }`
    }>2</NavLink>
     <NavLink to="/list3" className={(isActive)=>
      ` text-white text-2xl p-2 rounded-b-full
      ${isActive ? "bg-amber-400" : "bg-black" }`
    }>3</NavLink>
     <NavLink to="/list4" className={(isActive)=>
      ` text-white text-2xl p-2 rounded-b-full
      ${isActive ? "bg-amber-400" : "bg-black" }`
    }>4</NavLink>
  </ul>
</div>
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
              <ul className="grid gap-2 text-sm">
                <Link to="/" className="hover:text-white">Home</Link>
                <li className="hover:text-white">Shop</li>
                <li className="hover:text-white">Collections</li>
                <Link to="/contact" className="hover:text-white">Contact</Link>
              </ul>
            </div>
    
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Customer Service</h3>
              <ul className="grid gap-2 text-sm">
                <Link to="/chat" className="hover:text-white">FAQs</Link>
                <li className="hover:text-white">Returns</li>
                <li className="hover:text-white">Shipping</li>
                <li className="hover:text-white">Order Tracking</li>
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
}
export default List;
