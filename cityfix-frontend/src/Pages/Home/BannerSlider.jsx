import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import streetLight from '../../assets/bannerImages/broken-st-light.jpg';
import trafficLight from '../../assets/bannerImages/broken-traffic-light-2.webp';
import pothole from '../../assets/bannerImages/pothole-4.webp';
import speedCamera from '../../assets/bannerImages/fallen-speed-camera-3.jpg';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const BannerSlider = () => {
  const swiperRef = useRef(null);

  const slides = [
    { id: 1, img: streetLight, alt: "Banner slide 1" },
    { id: 2, img: trafficLight, alt: "Banner slide 2" },
    { id: 3, img: pothole, alt: "Banner slide 3" },
    { id: 3, img: speedCamera, alt: "Banner slide 3" },
  ];

  return (
    <div className="px-4 md:px-0">
      <div className="relative w-full max-w-130 mx-auto">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="rounded-2xl overflow-hidden shadow-xl"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.id}>
              {/* fixed height + object-cover */}
              <div className="w-full h-60 sm:h-70 md:h-85 lg:h-95">
                <img
                  src={s.img}
                  alt={s.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Left / Right buttons (DaisyUI) */}
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          className="btn btn-circle btn-sm md:btn-md bg-base-100/80 hover:bg-base-100 border border-base-300 text-accent absolute left-3 top-1/2 -translate-y-1/2 z-10 backdrop-blur"
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>

        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          className="btn btn-circle btn-sm md:btn-md bg-base-100/80 hover:bg-base-100 border border-base-300 text-accent absolute right-3 top-1/2 -translate-y-1/2 z-10 backdrop-blur"
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>

        {/* Optional subtle ring */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
      </div>
    </div>
  );
};

export default BannerSlider;
