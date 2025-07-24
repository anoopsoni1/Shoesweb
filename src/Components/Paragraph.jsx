function Paragraph() {

 const shoe = [
  {img : "./Front01.jpg" , name :  "Nike Dunk High" , price : "1500" , new : "New"} ,
  {img : "./Front02.jpeg" , name :  "WILBEN Women's Trekking Shoe - WS9143 Black 8" , price : "1400" ,new : "New"} ,
  {img : "./Front03.jpg" , name :  "adidas STEP N PACE SHOES - Black | adidas India" , price : "1300" ,new : "New"} ,
  {img : "./Front04.jpeg" , name :  "Men's Walking Shoes - Buy Walking Shoes For Men " , price : "1200" , new : "New"} ,
  {img : "./Front05.jpeg" , name :  " Men's Shoes: Running, Hiking & Everyday | HOKA®" , price : "1000" , new : "New"} ,
  {img : "./Front06.jpg" , name :  "Men's Casual Shoes" , price : "1500" , new : "New"} ,
 ] 

  return (
   <>
   <div className="sm:flex sm:ml-10 ml-2  justify-between sm:mr-10">
    <div className="sm:w-[550px] w-[42vh]  mt-10  grid gap-5 ">
      <p className="sm:text-7xl text-2xl font-semibold">We are Bold.</p>
      <p className="sm:text-[20px] text-[14px] text-gray-500">Bold design ,pushing boundaries,shoes that stant out.Each pair combines innovation,comfort,and style,designed to make a bold statement and elevate every occasion effortlessly</p>
    </div>
    <div className="sm:text-[150px] text-6xl  font-bold text-gray-500 drop-shadow-2xl drop-shadow-amber-600">SNEAKERS</div>
   </div>

 <div className="sm:mt-6 w-full mt-10 flex flex-wrap sm:gap-3 gap-0">
  {shoe.map((sh, i)=>(
  <div key={i}>
  <div className="sm:ml-12 hover:scale-105 ">
   <div className="h-[45vh] sm:w-[60vh] w-[50vh] sm:ml-0  bg-cover bg-center rounded-[6px]"
   style={{ backgroundImage:`url(${sh.img}) ` }}></div>
<p className="h-[5vh] w-[10vh] bg-white text-2xl relative bottom-[40vh] rotate-90 text-center ">{sh.new}</p>
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