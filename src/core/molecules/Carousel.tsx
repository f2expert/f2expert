import { useEffect, useState } from "react";

const slides = [
  { id: 1, image: "/assets/banner.jpg", title:"Your bright future is our missionsdf", caption: "Lorem ipsusfdm dolor sit amet, consectetur adipisicing elit" },
  { id: 2, image: "/assets/banner1.jpg", title:"Your bright future is our missionwer666", caption: "Lorem ipsurwem dolor sit amet, consectetur " },
  { id: 3, image: "/assets/banner2.jpg", title:"Your bright future is our mission342", caption: "Lorem ipsfdsum dolor sit amet, consectetur " },
];

export default function Carousel() {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, 5000);
  return () => clearInterval(interval);
}, []);

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="relative w-full mx-auto overflow-hidden bg-black">
      {/* Slides */}
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative w-full min-h-screen flex-shrink-0">
            <img src={slide.image} alt={slide.caption} className="w-full object-cover rounded opacity-45" />
            <p className="absolute top-1/2 left-4 transform -translate-y-1/2 max-w-3xl text-white bg-black bg-opacity-20 py-2">
              <strong className="text-5xl">{slide.title}</strong><br />
              {slide.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100"
        aria-label="Previous Slide"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100"
        aria-label="Next Slide"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            aria-label="Slide Indicator"
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}
