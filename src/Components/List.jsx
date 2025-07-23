import Secondheader from "./Secondheader";
import { useDispatch } from "react-redux";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { addtocart } from "../Feature/slice";
import { toast } from "react-toastify";
import {product} from "../ProductsList/One.jsx"
import { useState } from "react";
import { FaRegHeart } from "react-icons/fa6";
const products = [
  {
    id: 1,
    name: "Nike Air Max",
    price: 14999,
    image: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?cs=srgb&dl=pexels-craytive-1456706.jpg&fm=jpg",
  },
  {
    id: 2,
    name: "Adidas Ultraboost",
    price: 12999,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
  },
  {
    id: 3,
    name: "Puma RS-X",
    price: 9999,
    image: "https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_640.jpg",
  },
  {
    id: 4,
    name: "Reebok Classic",
    price: 7999,
    image: "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?cs=srgb&dl=pexels-mstudio-360817-1240892.jpg&fm=jpg",
  },
  {
    id: 5,
    name: "Jordan 1 Retro",
    price: 17999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtwHk2LbS4joC06LGw6hVIAhJD61JPPTty8g&s",
  },
  {
    id: 6,
    name: "New Balance 574",
    price: 8999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6PS9r5pHGaWR8Ps2-5nKybm57D9LIa9N1pw&s",
  },
   {
    id: 7,
    name: "New Balance 574",
    price: 8999,
    image: "https://i.pinimg.com/736x/2f/d5/d4/2fd5d44e37c3d178d60678a1961010c8.jpg",
  },
   {
    id: 8,
    name: "New Balance 574",
    price: 8999,
    image: "https://t4.ftcdn.net/jpg/03/66/57/71/360_F_366577181_uSV6BlMExtlVofV0xdkuEykF11OTIRT3.jpg",
  },
   {
    id: 9,
    name: "New Balance 574",
    price: 8999,
    image: "https://t3.ftcdn.net/jpg/06/12/00/18/360_F_612001823_TkzT0xmIgagoDCyQ0yuJYEGu8j6VNVYT.jpg",
  },
   {
    id: 10,
    name: "New Balance 574",
    price: 8999,
    image: "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/32085907/2024/12/25/af794381-a454-4a0c-bb4d-3646c42928301735143929280UnisexComfortableRunningShoes1.jpg",
  },
   {
    id: 11,
    name: "New Balance 574",
    price: 8999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD_nEW6vlxMluARSCdXjp6awXDnV5ZrBGHMw&s",
  },
   {
    id: 12,
    name: "New Balance 574",
    price: 8999,
    image: "https://png.pngtree.com/thumb_back/fh260/background/20240621/pngtree-running-shoes-with-mesh-and-black-and-white-soles-close-up-image_15805469.jpg",
  },
   {
    id: 13,
    name: "New Balance 574",
    price: 8999,
    image: "https://www.pixelstalk.net/wp-content/uploads/2016/07/HD-Air-Jordan-Shoes-Image.jpg",
  },
   {
    id: 14,
    name: "New Balance 574",
    price: 8999,
    image: "https://images.unsplash.com/photo-1651013691313-81b822df0044?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWRpZGFzJTIwc2hvZXxlbnwwfHwwfHx8MA%3D%3D",
  },
   {
    id: 15,
    name: "New Balance 574",
    price: 8999,
    image: "https://www.buyon.in/wp-content/uploads/2024/08/WhatsApp-Image-2023-10-29-at-11.34.10-AM-600x545.jpeg",
  },
   {
    id: 16,
    name: "New Balance 574",
    price: 8999,
    image: "https://c1.wallpaperflare.com/preview/426/87/675/shoe-adidas-sneaker.jpg",
  },
   {
    id: 17,
    name: "New Balance 574",
    price: 8999,
    image: "https://t4.ftcdn.net/jpg/04/79/11/23/360_F_479112366_dku6Ufwd9OVnRB3AZxonMgRzuZYeTTYY.jpg",
  },
   {
    id: 18,
    name: "New Balance 574",
    price: 8999,
    image: "https://handsomedans.co.uk/cdn/shop/products/hd-gustavo-shoes-825788.jpg?v=1642601455",
  },
];
const List = () => {
  const dispatch = useDispatch();

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
    const matchesCategory = category === "All" || product.category === category &&  product.price >= minPrice && product.price <= maxPrice
    return  matchesCategory;
  });

   const handlelikes = ()=>{
       const likes = document.getElementById("one")
   }
  
  return (
    <>
    <Secondheader />
     <div className="flex ">
      <div className="sm:block hidden">
    <aside className="w-32 sticky top-1 h-fit bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((cat, index) => (
            <li key={index}>
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products.map((product) => (
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
}
export default List;
