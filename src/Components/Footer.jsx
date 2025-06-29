import { PiShieldStarFill } from "react-icons/pi";
import { MdOutlineDocumentScanner } from "react-icons/md";
function Footer() {
  return (
    <>
<div className="sm:ml-6 ml-3 mt-10 sm:flex justify-between ">
    <div className="grid gap-10">
        <div className="sm:w-[80vh] w-[50vh]">
    <PiShieldStarFill size={40} />
    <h1 className="text-2xl font-semibold mb-2 mt-2">Unmatched Comfort and Durability</h1>
    <p className=" text-gray-800 font-semibold">Experience long-lasting comfort with premium materials and expert creaftmanship designed to support every step,day after day</p>
        </div>
 <hr />
       <div className="sm:w-[80vh] w-[50vh] ">
    <MdOutlineDocumentScanner  size={40}/>
    <h1 className="text-2xl font-semibold mb-2 mt-2">Stylish Design,Superior Performance</h1>
    <p className="text-[18px] text-gray-800 font-semibold">Step into style with sleek,modern designs while enjoying top-tier performance for all your active adventures</p>
        </div>
  <hr/>
        <div className="sm:w-[80vh] w-[50vh]">
    <h1 className="text-2xl font-semibold mb-2 mt-2">Subscribe</h1>
    <p className=" text-gray-800 font-semibold">Subscribe to our newsletter for early access and exclusive content</p>
        </div>
    </div>
    <div>
        <div className="sm:w-[63.9vh] w-[49vh] sm:mr-[30vh] mt-20">
            <h1 className="sm:text-6xl text-2xl font-bold sm:block hidden">&copy; 2025 SoleMate Shoes.All rights reserved.</h1>
            <div className="flex justify-between mt-14">
                <div>
                    <ul className="grid gap-2 font-semibold ">
                    <li className="hover:text-black text-gray-700">Register/Sign In</li>
                    <li className="hover:text-black text-gray-700">Account</li>
                    <li className="hover:text-black text-gray-700">Orders</li>
                    <li className="hover:text-black text-gray-700">Shipping & Returns</li>
                    </ul>
                </div>
                <div>
                    <ul className="grid gap-2 font-semibold">
                    <li className="hover:text-black text-gray-700">FAQ</li>
                    <li className="hover:text-black text-gray-700">Contact Us</li>
                    <li className="hover:text-black text-gray-700">Careers</li>
                    <li className="hover:text-black text-gray-700"> Instagram</li>
                    </ul>
                </div>
            </div>
            <div className="sm:hidden block">
                        <h1 className="sm:text-6xl text-[14px] font-bold sm:mt-0 mt-10">&copy; 2025 SoleMate Shoes.All rights reserved.</h1>
             </div>
        </div>
    </div>
</div>
    </>
  )
}

export default Footer