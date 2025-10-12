import React from 'react'
import { MdArrowOutward } from "react-icons/md";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Model from './model';
import { useNavigate } from 'react-router-dom';



function Page() {

const navi = useNavigate()


const handlepage = function(){
      setTimeout(()=>{
        navi("/list")
      },500)
}


  return (
   <>
    <div className=' sm:flex grid justify-between mr-10 pb-[15.52vh]'>
      <div className='sm:mt-32 sm:ml-10 mt-16 ml-5 grid'>
       <p className='sm:text-7xl text-2xl font-bold text-white'>Discover</p>
       <p className='sm:text-7xl text-2xl font-bold text-white'>Comfort and Style for</p>
       <p className='sm:text-7xl text-2xl font-bold text-white'>Every Occasion</p>
       <p className='mt-2 sm:text-[20px] text-[14px] w-[50vh] sm:w-full text-gray-300'>Discover the perfect balance of comfort,durability,and style for every</p> 
       <p className='text-gray-300 sm:text-[20px] text-[14px] w-[50vh] sm:w-full'>occasion with our versatile,high-quality footwear collection</p>
         <div className='sm:block hidden'>
         <div onClick={handlepage} className='mt-16 ml-10 h-11 w-[200px] rounded-3xl bg-gradient-to-r from-yellow-300 to-yellow-600 flex justify-between place-items-center '>
        <button  className='ml-4 text-[18px] mb-1 font-bold'>Explore</button>
            <div className='rounded-full bg-amber-50 mr-1'><MdArrowOutward  size={35}/></div>
         </div>
         </div>
      </div>
    <div className="sm:w-[90vh] sm:h-[70vh] sm:mt-14 w-[40vh] h-[30vh] mt-7 sm:ml-0 ml-6 border-8 rounded-[15vh] border-y-neutral-50  border-e-amber-300 border-l-amber-300 border-s-stone-50 ">
      <div className=' flex place-items-center bg-cover bg-[url("./bg99.png")]  '>
           <Model  />
        </div>
        </div>
        <div  className='sm:hidden block ml-5 '>
          <div onClick={handlepage} className='mt-16 ml-10 h-11 w-[200px] rounded-3xl bg-black flex justify-between place-items-center'>
        <button  className='ml-4 text-[18px] mb-1 text-white'>Explore</button>
          <div className='rounded-full bg-amber-50 mr-1'><MdArrowOutward  size={35}/></div>
         </div>
        </div>
      </div>

       
   </>
  )
}

export default Page



