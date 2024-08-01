import React, { useState } from "react";
import "./StarInfluenceAwards.scss"; // Remove if using Tailwind for all styling
import travelImage from "../../../../../assets/images/Home/travel.svg";
import cookingImage from "../../../../../assets/images/Home/cooking.svg";
import lifeStyleImage from "../../../../../assets/images/Home/lifeStyle.svg";

const StarInfluenceAwards: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [travelImage, cookingImage, lifeStyleImage];

  return (
    <div className="bg-image flex flex-col md:flex-row items-center py-8">
      <div className="flex flex-col md:flex-row items-center w-full">
        <div className="md:w-7/12 flex flex-col items-start p-5 md:p-0 mt-4 md:mt-0 order-2 md:order-1">
          <div className="text-left px-4 md:px-12">
            <h1 className="text-2xl md:text-5xl text-gray-700">
              What Are Star
              <br />
              Influence Awards?
            </h1>
            <div>
              <p className="text-sm md:text-base mt-4">
                The third annual Influence Awards are a celebration of the
                industry's top performers in influencer marketing! This year,
                we have multiple awards across a variety of categories.
              </p>
            </div>
            <div className="py-4">
              <p className="text-sm md:text-base">
                These digital awards are curated by our Judges panel, an
                award-winning digital and influencer marketing agency—but the
                winners are chosen by you!
              </p>
            </div>
          </div>
          <div className="mt-6 px-4 md:px-12">
            <button type="submit" className="submit-button">
              View Last Year's Winners
            </button>
          </div>
        </div>
        <div className="md:w-5/12 flex justify-center my-5 md:my-0 md:block order-1 md:order-2">
          <div id="default-carousel" className="relative w-full" data-carousel="slide">
            {/* Carousel wrapper */}
            <div className="relative overflow-hidden rounded-lg h-64 md:h-96">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`duration-700 ease-in-out ${
                    index !== currentIndex ? "hidden" : ""
                  }`}
                  data-carousel-item
                >
                  <img
                    src={image}
                    className="block w-full h-full object-cover"
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            {/* Slider indicators */}
            <div className="flex justify-center mt-4 space-x-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === index ? "bg-gray-800" : "bg-gray-400"
                  }`}
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

export default StarInfluenceAwards;
