import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
function Home() {
  return (
   <>
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
                    <li className="bg-amber-100 p-3 rounded-[5px]" ><FaShoppingBag /></li>
                    <li className="bg-amber-100 p-3 rounded-[5px]"><FaRegUserCircle /></li>
                </ul>
             </div>
             <div className="flex sm:hidden none list-none gap-1">
                <li className="bg-amber-100 p-3 rounded-[5px]"><FaRegHeart/></li>
                <li className="bg-amber-100 p-3 rounded-[5px]"><FaShoppingBag /></li>
                <li className="bg-amber-100 p-3 rounded-[5px]"><FaRegUserCircle /></li>
             </div>
        </nav>
    </header>
   </>
  )
}

export default Home