import React, { useEffect, useState } from "react";
import "./LastYearWinners.scss"; // Remove if using Tailwind for all styling
import travelImage from "../../../assets/images/Home/travel.svg";
import cookingImage from "../../../assets/images/Home/cooking.svg";
import lifeStyleImage from "../../../assets/images/Home/lifeStyle.svg";

const LastYearWinners: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [travelImage, cookingImage, lifeStyleImage];

  return (
    <div className="bg-image flex flex-col md:flex-row items-center">
      <div className="flex flex-col md:flex-row items-center w-full">
        <div className="md:w-7/12 flex flex-col items-start p-5 md:p-0 mt-4 md:mt-0">
          <div className="text-center px-12">
            <span className="text-6xl md:text-7xl text-gray-700">
              Last Year's
              <br />
              Winners
            </span>
          </div>
          <div className="mt-6 px-12">
            <button type="submit" className="submit-button">
              VIEW ALL Winners
            </button>
          </div>
        </div>
        <div className="md:w-3/12 flex justify-start my-5 md:my-0 md:block">
          <div id="default-carousel" className="relative w-full" data-carousel="slide">
            {/* Carousel wrapper */}
            <div className="relative overflow-hidden rounded-lg md:h-96">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`duration-700 ease-in-out ${index !== currentIndex && 'hidden'}`}
                  data-carousel-item
                >
                  <img
                    src={image}
                    className="block w-full h-96 object-cover"
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            {/* Slider indicators */}
            <div className="flex justify-center mt-4 space-x-3 rtl:space-x-reverse">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-gray-800' : 'bg-gray-400'}`}
                  aria-current={currentIndex === index}
                  aria-label={`Slide ${index + 1}`}
                  data-carousel-slide-to={index}
                  onClick={() => setCurrentIndex(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastYearWinners;
