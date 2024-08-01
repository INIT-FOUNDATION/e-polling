import React from "react";
import "./WhoCanEnter.scss";
import polygon from "../../../../../assets/images/Home/Polygon.svg";

const WhoCanEnter: React.FC = () => {
  return (
    <div className="background-image flex flex-wrap justify-center md:justify-between items-center p-5 md:p-10">
      <div className="flex flex-col items-center md:w-1/2 p-5 md:p-0 md:mt-10">
        <img
          src={polygon}
          alt="polygon"
          style={{ height: "500px", width: "597px" }}
        />
      </div>

      <div className="flex flex-col items-center md:w-1/2 p-5 md:p-0 mt-4 md:mt-10">
        <img
          src={polygon}
          alt="polygon"
          style={{ height: "500px", width: "597px" }}
        />
      </div>
    </div>
  );
};

export default WhoCanEnter;
