import React from "react";

function Paragraph() {
  const shoe = [
    { img: "./Front01.jpg", name: "Nike Dunk High", price: "1500", new: "New" },
    { img: "./Front02.jpeg", name: "WILBEN Women's Trekking Shoe - WS9143 Black 8", price: "1400", new: "New" },
    { img: "./Front03.jpg", name: "adidas STEP N PACE SHOES - Black | adidas India", price: "1300", new: "New" },
    { img: "./Front04.jpeg", name: "Men's Walking Shoes - Buy Walking Shoes For Men", price: "1200", new: "New" },
    { img: "./Front05.jpeg", name: "Men's Shoes: Running, Hiking & Everyday | HOKA®", price: "1000", new: "New" },
    { img: "./Front06.jpg", name: "Men's Casual Shoes", price: "1500", new: "New" },
  ];

  return (
    <>
     
      <div className="flex flex-col sm:flex-row sm:ml-10 ml-2 justify-between sm:mr-10 items-start">
        <div className="sm:w-1/2 w-full mt-10 flex flex-col gap-5">
          <p className="text-3xl sm:text-7xl font-semibold leading-tight">We are Bold.</p>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Bold design, pushing boundaries, shoes that stand out. Each pair combines innovation, comfort, and style, designed to make a bold statement and elevate every occasion effortlessly.
          </p>
        </div>
        <div className="sm:text-[150px] text-6xl font-bold text-gray-500 drop-shadow-2xl drop-shadow-amber-600 mt-6 sm:mt-0">
          SNEAKERS
        </div>
      </div>

      <div className="mt-10 sm:mt-6 w-full flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
        {shoe.map((sh, i) => (
          <div key={i} className="hover:scale-105 transition-transform duration-300">
            <div
              className="w-[90vw] sm:w-[55vh] h-[45vh] sm:h-[50vh] bg-cover bg-center rounded-lg relative"
              style={{ backgroundImage: `url(${sh.img})` }}
            >
              <span className="absolute top-2 left-2 bg-white text-black px-2 py-1 text-xs sm:text-sm font-semibold rounded">
                {sh.new}
              </span>
            </div>
            <p className="mt-2 font-semibold text-sm sm:text-base">{sh.name}</p>
            <p className="text-gray-500 text-xs sm:text-sm">₹{sh.price}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Paragraph;
