import React from 'react'
import { MdArrowOutward } from "react-icons/md";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Model from './model';

function Page() {

const swipe = [
{img:"https://media.istockphoto.com/id/175537625/photo/sneakers-with-clipping-path.jpg?s=612x612&w=0&k=20&c=jfv13YfaYpAIzNlLY0e1dxVeizWsacok3klJqT9_GeM="},
{img:"https://png.pngtree.com/thumb_back/fh260/background/20240704/pngtree-sport-shoes-white-sneakers-on-a-white-background-image_15859558.jpg"},
{img:"https://file.aiquickdraw.com/imgcompressed/img/compressed_f8769206cd169f1edea6929c085e5cc1.webp" },
{img:"https://media.istockphoto.com/id/1620926852/photo/white-sneaker-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=CcYj5SYufcuFxUy-l9u1pgDbz62Ty3aD_FaCpqBCaM8=" },
{img:"https://image.similarpng.com/file/similarpng/original-picture/2020/09/Nike-basketball-shoes-red-and-white-on-transparent-background-PNG.png" },
{img:"https://png.pngtree.com/png-clipart/20240921/original/pngtree-white-shoes-beautiful-transparent-background-vector-png-image_16051232.png" },
{img:"https://img.freepik.com/free-photo/sport-running-shoes_1203-3414.jpg?semt=ais_hybrid&w=740" },
{img:"https://sportsstation.in/cdn/shop/files/61LxZsUZv6L._SY695.jpg?v=1748956245" },
{img:"https://t3.ftcdn.net/jpg/01/98/11/36/360_F_198113627_E5hQnRt4BsqtRL6N4wiELAS9Y59oYLnc.jpg" },
{img:"https://in.victorsport.com/files/in/product/list_90412_20220517144520.jpg" },
{img:"https://images-static.nykaa.com/media/catalog/product/f/4/f4bf23139842701_1.jpg?tr=w-500" },
{img:"https://wwd.com/wp-content/uploads/2025/06/nike-p-6000-se.jpg?w=1000" },
{img:"https://img.freepik.com/free-photo/new-pair-white-sneakers-isolated-white_93675-130969.jpg?semt=ais_hybrid&w=740" },
]

  return (
   <>
    <div className=' sm:flex grid justify-between mr-10'>
      <div className='sm:mt-32 sm:ml-10 mt-16 ml-5 grid'>
       <p className='sm:text-7xl text-2xl font-semibold'>Discover</p>
       <p className='sm:text-7xl text-2xl font-semibold'>Comfort and Style for</p>
       <p className='sm:text-7xl text-2xl font-semibold'>Every Occasion</p>
       <p className='mt-2 sm:text-[20px] text-[14px] w-[50vh] sm:w-full'>Discover the perfect balance of comfort,durability,and style for every</p> 
       <p className='sm:text-[20px] text-[14px] w-[50vh] sm:w-full'>occasion with our versatile,high-quality footwear collection</p>
         <div className='sm:block hidden'>
         <div className='mt-16 ml-10 h-11 w-[200px] rounded-3xl bg-black flex justify-between place-items-center '>
        <button className='ml-4 text-[18px] mb-1 text-white'>Explore</button>
            <div className='rounded-full bg-amber-50 mr-1'><MdArrowOutward  size={35}/></div>
         </div>
         </div>
      </div>
    <div className="sm:w-[80vh] sm:h-[60vh] sm:mt-14 w-[40vh] h-[30vh] mt-7 sm:ml-0 ml-10">
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
              className="h-full bg-cover bg-center relative rounded-2xl "
              style={{ backgroundImage:`url(${slider.img})` }}
            >
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
        </div>
        <div className='sm:hidden block ml-5'>
          <div className='mt-16 ml-10 h-11 w-[200px] rounded-3xl bg-black flex justify-between place-items-center'>
        <button className='ml-4 text-[18px] mb-1 text-white'>Explore</button>
            <div className='rounded-full bg-amber-50 mr-1'><MdArrowOutward  size={35}/></div>
         </div>
        </div>
      </div>
       <div className='sm:h-[100vh] h-[50vh] bg-cover bg-[url("./bg.png")] flex place-item-center sm:ml-0 ml-3'>
         <Model />
       </div>
   </>
  )
}

export default Page