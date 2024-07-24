import React from "react";
import "./LastYearWinners.scss"; // You can remove this if you're using Tailwind for all styling

const LastYearWinners: React.FC = () => {
  return (
    <div className="bg-image flex flex-col md:flex-row items-center">
      <div className="flex flex-col md:flex-row items-center w-full">
        <div className="md:w-7/12 flex flex-col items-start p-5 md:p-0 mt-4 md:mt-0">
          <div className="text-center px-10">
            <span className="text-6xl md:text-7xl text-gray-700">
              Last Year's
              <br />
              Winners
            </span>
          </div>
          <div className="mt-6 px-10">
            {" "}
            {/* Adjust spacing between text and button */}
            <button type="submit" className="submit-    button">
              VIEW ALL Winners
            </button>
          </div>
        </div>
        <div className="md:w-5/12 flex justify-start my-5 md:my-0  md:block">
          <img
            src="/assets/images/bannerHomePage.svg"
            className="w-full"
            alt="Banner"
          />
        </div>
      </div>
    </div>
  );
};

export default LastYearWinners;
