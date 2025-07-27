import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Page from "./Page";
function Home() {
  return (
   <>
   <div className="bg-[url('/bg.png')] bg-cover bg-center">
    <header className="relative">
        <nav className="mt-5 ml-5 flex justify-between ">
            <div >
                <p className="text-2xl font-medium">SoleMate</p>
            </div>
             <div className="sm:block hidden">
                <ul className="flex gap-8 mt-1 font-semibold place-items-center mr-5 ">
                    <li>Featured</li>
                    <li>Men</li>
                    <li>Women</li>
                    <li>Kids</li>
                    <li>Accessories</li>
                    <li>Sale</li>
                    <li className="bg-amber-100 p-3 rounded-[5px]"><FaRegHeart/></li>
                     <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px]"><FaShoppingBag /></Link>
                    <Link to="/login" className="bg-amber-100 p-3 rounded-[5px]"><FaRegUserCircle /></Link>
                </ul>
             </div>
             <div className="flex sm:hidden none list-none gap-1">
                <li className="bg-amber-100 p-3 rounded-[5px]"><FaRegHeart/></li>
                <Link to="/cart" className="bg-amber-100 p-3 rounded-[5px]"><FaShoppingBag /></Link>
                <li className="bg-amber-100 p-3 rounded-[5px]"><FaRegUserCircle /></li>
             </div>
        </nav>
    </header>
    <Page />
    </div>
    
   </>
  )
}

export default Home