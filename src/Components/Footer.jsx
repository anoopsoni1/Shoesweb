import { PiShieldStarFill } from "react-icons/pi";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const user = useSelector((state) => state.user.userData);

  return (
    <div className="mt-12 px-4 sm:px-7">
      <div className="flex flex-col sm:flex-row justify-between gap-10">
   
        <div className="flex flex-col gap-3 sm:w-1/3 w-full">
          <PiShieldStarFill size={30} />
          <h1 className="text-xl sm:text-2xl font-semibold">Unmatched Comfort and Durability</h1>
          <p className="text-gray-800 text-sm sm:text-base font-semibold">
            Experience long-lasting comfort with premium materials and expert craftsmanship designed to support every step, day after day.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:w-1/3 w-full">
          <MdOutlineDocumentScanner size={30} />
          <h1 className="text-xl sm:text-2xl font-semibold">Stylish Design, Superior Performance</h1>
          <p className="text-gray-800 text-sm sm:text-base font-semibold">
            Step into style with sleek, modern designs while enjoying top-tier performance for all your active adventures.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:w-1/3 w-full">
          <h1 className="text-xl sm:text-2xl font-semibold">Subscribe</h1>
          <p className="text-gray-800 text-sm sm:text-base font-semibold">
            Subscribe to our newsletter for early access and exclusive content.
          </p>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

 
      <div className="flex flex-col sm:flex-row justify-between gap-10">
 
        <div className="flex flex-col sm:flex-row gap-10 w-full sm:w-auto">
          <ul className="flex flex-col gap-3 sm:gap-2 font-semibold text-gray-700">
            <Link to="/SignIn" className="hover:text-black hover:underline">Register/Sign In</Link>
            <Link to="/dashboard" className="hover:text-black hover:underline">Account</Link>
            <Link to="/Order" className="hover:text-black hover:underline">Orders</Link>
            <li className="hover:text-black">Shipping & Returns</li>
          </ul>

          <ul className="flex flex-col gap-3 sm:gap-2 font-semibold text-gray-700">
            {user ? (
              <Link to="/chat" className="hover:text-black">FAQ</Link>
            ) : (
              <Link to="/login" className="hover:text-black">FAQ</Link>
            )}
            <Link to="/contact" className="hover:text-black hover:underline">Contact Us</Link>
            <li className="hover:text-black">Careers</li>
            <li className="hover:text-black">Instagram</li>
          </ul>
        </div>

       
        <div className="text-center sm:text-right mt-6 sm:mt-0 text-gray-700 text-sm sm:text-base font-bold">
          &copy; 2025 SoleMate Shoes. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default Footer;
