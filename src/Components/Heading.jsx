import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

function Heading() {
  const messages = [
    "Enjoy an exclusive 10% coupon for your first purchase",
    "Free shipping on orders over $50",
    "New arrivals just dropped! Check them out",
    "Limited time offer: Buy 1 Get 1 50% off",
  ];

  return (
    <div className="bg-black w-full text-white h-10 flex items-center justify-center overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={1}
        speed={800}
      >
        {messages.map((msg, index) => (
          <SwiperSlide key={index}>
            <p className="text-center sm:text-sm text-[10px]">{msg}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Heading;
