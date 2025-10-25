import React from 'react';
import { MdArrowOutward } from "react-icons/md";
import Model from './model';
import { useNavigate } from 'react-router-dom';
import InstallPrompt from './Installprompt';

function Page() {
  const navi = useNavigate();

  const handlepage = () => {
    setTimeout(() => {
      navi("/list");
    }, 500);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start px-5 sm:px-10 pb-[15.52vh]">
        {/* Left Section */}
        <div className="flex flex-col sm:w-1/2 gap-3 sm:gap-4 mt-16 sm:mt-32">
          <p className="text-3xl sm:text-7xl font-bold text-white leading-tight">
            Discover
          </p>
          <p className="text-3xl sm:text-7xl font-bold text-white leading-tight">
            Comfort and Style for
          </p>
          <p className="text-3xl sm:text-7xl font-bold text-white leading-tight">
            Every Occasion
          </p>

          <p className="mt-2 text-gray-300 text-sm sm:text-base max-w-[90%] sm:max-w-full">
            Discover the perfect balance of comfort, durability, and style for every
          </p>
          <p className="text-gray-300 text-sm sm:text-base max-w-[90%] sm:max-w-full">
            occasion with our versatile, high-quality footwear collection
          </p>

          {/* Desktop Explore Button */}
          <div className="hidden sm:flex mt-6">
            <div
              onClick={handlepage}
              className="h-12 w-52 rounded-3xl bg-gradient-to-r from-yellow-300 to-yellow-600 flex items-center justify-between px-4 cursor-pointer hover:scale-105 transition-transform"
            >
              <button className="text-lg font-bold">Explore</button>
              <div className="rounded-full bg-amber-50 p-1">
                <MdArrowOutward size={30} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="mt-8 sm:mt-14 sm:w-1/2 flex justify-center">
          <div className="w-[90vw] max-w-[90vh] h-[40vh] sm:h-[70vh] rounded-[3rem] border-8 border-y-neutral-50 border-l-amber-300 border-e-amber-300 overflow-hidden flex items-center justify-center bg-cover bg-center bg-[url('./bg99.png')] shadow-lg">
            <Model />
          </div>
        </div>

        {/* Mobile Explore Button */}
        <div className="sm:hidden flex justify-center w-full mt-6">
          <div
            onClick={handlepage}
            className="h-12 w-52 rounded-3xl bg-black flex items-center justify-between px-4 cursor-pointer hover:scale-105 transition-transform"
          >
            <button className="text-lg font-bold text-white">Explore</button>
            <div className="rounded-full bg-amber-50 p-1">
              <MdArrowOutward size={30} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
