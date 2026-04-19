import React from "react";

function Lower() {
  return (
    <section className="relative mx-4 mt-4 mb-8 sm:mx-6 sm:mb-12 lg:mx-8">
      <img
        src="./image.png"
        alt="Featured training footwear banner"
        className="hidden h-[min(80vh,720px)] w-full rounded-2xl object-cover shadow-lg sm:block"
      />

      <img
        src="./mobile.png"
        alt="Featured training footwear banner"
        className="block h-[min(60vh,520px)] w-full rounded-2xl object-cover shadow-md sm:hidden"
      />


      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 px-4 sm:px-10">
        

        <div className="text-center sm:text-left sm:w-1/2 flex flex-col gap-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
            DROPSET 3
          </h1>
          <p className="text-white text-sm sm:text-lg lg:text-xl font-semibold">
            A perfect blend of performance, durability, and style for every athlete and adventure.
          </p>
        </div>

       
        <div className="hidden sm:flex sm:w-1/2 flex-col gap-3 text-right">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
            ADIZERO EVO SL
          </h1>
          <p className="text-white text-sm sm:text-lg lg:text-xl font-semibold">
            Unleash speed and agility with lightweight, high-performance design, engineered for optimal comfort and precision.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Lower;
