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
import { useRef } from 'react';


function Page() {
const ref = useRef()
const navi = useNavigate()

const swipe = [
{img:"./01.png"},
{img:"./02.png"},
{img:"./03.png" },
{img:"./04.png" },
{img:"./05.png" },
{img:"./06.png" },
{img:"./07.png" },
{img:"./08.png" },
{img:"./09.png" },
{img:"./10.png" },
{img:"./11.png" },
]

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
    <div className="sm:w-[90vh] sm:h-[65vh] sm:mt-14 w-[40vh] h-[30vh] mt-7 sm:ml-0 ml-6">
        <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
         loop={true}
         effect="coverflow"
        className="h-full"
      >
        {swipe.map((slider, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="h-full bg-cover bg-center relative rounded-2xl"
            >
              <img 
              loading='lazy'
              src={slider.img} alt="" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
        </div>
        <div  className='sm:hidden block ml-5 '>
          <div onClick={handlepage} className='mt-16 ml-10 h-11 w-[200px] rounded-3xl bg-black flex justify-between place-items-center'>
        <button  className='ml-4 text-[18px] mb-1 text-white'>Explore</button>
          <div className='rounded-full bg-amber-50 mr-1'><MdArrowOutward  size={35}/></div>
         </div>
        </div>
      </div>
<div className='sm:h-[100vh] h-[50vh] bg-cover bg-[url("./bg99.png")] flex place-item-center'>
           <Model  />
        </div>
       
   </>
  )
}

export default Page



