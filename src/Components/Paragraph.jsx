function Paragraph() {

 const shoe = [
  {img : "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png" , name :  "Nike Dunk High" , price : "1500" , new : "New"} ,
  {img : "https://cdn.thewirecutter.com/wp-content/media/2023/08/watershoes-2048px-1243.jpg?auto=webp&quality=75&width=1024" , name :  "WILBEN Women's Trekking Shoe - WS9143 Black 8" , price : "1400" ,new : "New"} ,
  {img : "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b6b6036a0a2c436ba5543f30348533f8_9366/STEP_N_PACE_SHOES_Black_IQ9157_01_standard.jpg" , name :  "adidas STEP N PACE SHOES - Black | adidas India" , price : "1300" ,new : "New"} ,
  {img : "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/377048/02/sv01/fnd/IND/fmt/png/SOFTRIDE-Enzo-Evo-Running-Shoes" , name :  "Men's Walking Shoes - Buy Walking Shoes For Men " , price : "1200" , new : "New"} ,
  {img : "https://dms.deckers.com/hoka/image/upload/t_product-medium/v1736215828/1162030-STLLR_1.png?_s=RAABAB0" , name :  " Men's Shoes: Running, Hiking & Everyday | HOKA®" , price : "1000" , new : "New"} ,
  {img : "https://www.newbalance.com/dw/image/v2/AAGI_PRD/on/demandware.static/-/Library-Sites-NBUS-NBCA/default/dw51961072/images/page-designer/2025/January_2/NB-2840_X2_Image_1906.jpg" , name :  "Men's Casual Shoes" , price : "1500" , new : "New"} ,
 ] 

  return (
   <>
   <div className="sm:flex sm:ml-10 ml-5  justify-between sm:mr-10">
    <div className="sm:w-[550px] w-[50vh]  mt-10  grid gap-5 ">
      <p className="sm:text-7xl text-2xl font-semibold">We are Bold.</p>
      <p className="sm:text-[20px] text-[14px] text-gray-500">Bold design ,pushing boundaries,shoes that stant out.Each pair combines innovation,comfort,and style,designed to make a bold statement and elevate every occasion effortlessly</p>
    </div>
    <div className="sm:text-[150px] text-6xl  font-bold text-gray-500 drop-shadow-2xl drop-shadow-amber-600">SNEAKERS</div>
   </div>

 <div className="sm:mt-6 w-full mt-10 flex flex-wrap gap-0">
  {shoe.map((sh, i)=>(
  <div key={i}>
  <div className="sm:ml-12">
   <div className="h-[45vh] sm:w-[60vh] w-[54.26vh]  bg-cover bg-center"
   style={{ backgroundImage:`url(${sh.img})` }}></div>
<p className="h-[5vh] w-[10vh] bg-white sm:p-1  text-2xl relative bottom-[40vh] rotate-90 text-center ">{sh.new}</p>
    <p className="font-semibold ">{sh.name}</p>
   <p className="sm:text-[13px] text-[12px] text-gray-500">₹{sh.price}</p>
  </div>
  </div>
  ))}
 </div>
   </>
  )
}

export default Paragraph