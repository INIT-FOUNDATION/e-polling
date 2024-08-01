import React from "react";
import polygon from "../../../../../assets/images/Home/Polygon.svg";

const WhoCanEnter: React.FC = () => {
  return (
    <div className="background-image flex flex-col md:flex-row justify-center md:justify-between items-center p-5 md:p-10 py-32">
      <div className="relative flex flex-col items-center md:w-1/2 p-5 md:p-0 mt-4 md:mt-0">
        <img
          src={polygon}
          alt="polygon"
          className="w-full h-auto"
          style={{ maxWidth: "597px", maxHeight: "500px" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            Who Can Enter
          </h2>
          <p className="text-sm md:text-base text-black mb-6">
            Once the nomination period is open, anyone can submit a nomination
            through a simple form submission. From there, the award finalists
            will be hand-selected by a panel of industry experts across our 22
            categories.
          </p>
          <p>
            Be sure to keep an eye out for future announcements so you don’t
            miss the chance to be nominated or nominate someone you think
            deserves to win!
          </p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Click Me
          </button>
        </div>
      </div>

      <div className="relative flex flex-col items-center md:w-1/2 p-5 md:p-0 mt-4 md:mt-0">
        <img
          src={polygon}
          alt="polygon"
          className="w-full h-auto"
          style={{ maxWidth: "597px", maxHeight: "500px" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-xl md:text-2xl font-bold text-black mb-4">
            Who Can Enter
          </h2>
          <p style={{ fontSize: '0.8rem' }} className="text-black mb-6">
  Once the nomination period is open, anyone can submit a
  <br />
  nomination through a simple form submission. From there,
  <br />
  the award finalists will be hand-selected by a panel of
  <br />
  industry experts across our 22 categories.
</p>
<p style={{ fontSize: '0.8rem' }} className="text-black mb-6">
  Be sure to keep an eye out for
  <br/> future announcements so you don’t
  <br />
  miss the chance to be nominated or
  <br/> nominate someone you think
  deserves to win!
</p>

          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Click Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhoCanEnter;
