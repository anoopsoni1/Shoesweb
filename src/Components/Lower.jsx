

function Lower() {
  return (
   <>
 <div className='mt-12 ml-7 mr-7'>  
  <div className='relative '>
<img src="./image.png" alt="" className='h-[80vh] w-full object-cover sm:block hidden' />
<img src="./mobile.png" alt="" className='h-[80vh] w-full object-cover sm:hidden' />
<div className="flex justify-between">
     <div className="absolute top-[40vh] text-center grid gap-5">
        <h1 className="text-2xl text-white font-semibold">DROPSET 3</h1>
        <p className="sm:w-[90vh] w-[42vh] font-semibold sm:text-2xl text-[15px] text-white">A perfect blend of performance,durability,and style for every athlete and adventure.</p>
     </div>
      <div className="sm:block hidden">
     <div className="absolute right-0 top-[40vh] text-center grid gap-5 ">
        <h1 className="text-2xl text-white font-semibold">ADIZERO EVO SL</h1>
        <p className='w-[100vh] text-2xl text-white font-semibold'>Unleash speed and agility with lightweight,high-performance design,engineered for optimal comfort and precision</p>
     </div>
     </div>
     </div>
  </div>
 </div>
  </>
  )
}

export default Lower