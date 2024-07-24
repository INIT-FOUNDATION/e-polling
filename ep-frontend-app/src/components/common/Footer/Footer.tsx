import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="flex flex-wrap">
        <div className="w-full md:w-7/12 lg:w-8/12">
          <img src="../../assets/images/Footer/starInfluence.svg" alt="icon" className="width:10rem"
       />
          <div className="footer-label font-medium mt-5 px-4">
            “Appreciating the talent of people with a special spark"
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
