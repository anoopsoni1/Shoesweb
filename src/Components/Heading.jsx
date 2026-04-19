import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useTheme } from "../context/ThemeContext.jsx";

function Heading() {
  const { isDark } = useTheme();
  const messages = [
    "Enjoy an exclusive 10% coupon on your first purchase",
    "Free shipping on orders over ₹50",
    "New arrivals just dropped — explore the collection",
    "Limited time: curated bundles at special prices",
  ];

  const bar = isDark
    ? "border-b border-zinc-800 bg-zinc-900 text-zinc-100"
    : "border-b border-zinc-200 bg-zinc-900 text-white";

  return (
    <div className={`${bar} flex h-10 w-full shrink-0 items-center justify-center overflow-hidden`}>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        slidesPerView={1}
        speed={700}
        className="h-full w-full"
      >
        {messages.map((msg, index) => (
          <SwiperSlide key={index} className="!flex items-center justify-center">
            <p className="px-4 text-center text-[11px] font-medium tracking-wide sm:text-sm">
              {msg}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Heading;
