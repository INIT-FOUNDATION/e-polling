import React from "react";

import InfluencerImage from "../../../assets/images/Categories/Influencer.svg";
import AgencyImage from "../../../assets/images/Categories/Agency.svg";
import CampaignImage from "../../../assets/images/Categories/Campaign.svg";

const Categories: React.FC = () => {
  return (
    <div className="p-10 bg-[#F9F3FD]">
      <h1 className="flex justify-center items-center text-[39.2px] text-[#333333] mb-8">
        Categories
      </h1>
      <div className="flex justify-center flex-wrap">
        <div className="relative m-6 overflow-hidden group cursor-pointer">
          <img
            src={InfluencerImage}
            alt="Influencer"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 w-full p-4 rounded-b-[40px] bg-[rgba(27,27,27,.5)] text-white transition-all duration-500 ease-in-out flex flex-col justify-end group-hover:h-[160px]">
            <div className="flex flex-col justify-end h-full transition-transform duration-500 ease-in-out transform group-hover:translate-y-[-10px]">
              <h1 className="text-4xl text-center mb-2">Influencer</h1>
              <p className="hidden group-hover:block text-xl text-center opacity-0 translate-y-4 transition-opacity duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
                dolore adipisci placeat.
              </p>
            </div>
          </div>
        </div>
        <div className="relative m-6 overflow-hidden group cursor-pointer">
          <img
            src={AgencyImage}
            alt="Agency"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 w-full p-4 rounded-b-[40px] bg-[rgba(27,27,27,.5)] text-white transition-all duration-500 ease-in-out flex flex-col justify-end group-hover:h-[160px]">
            <div className="flex flex-col justify-end h-full transition-transform duration-500 ease-in-out transform group-hover:translate-y-[-10px]">
              <h1 className="text-4xl text-center mb-2">Agency</h1>
              <p className="hidden group-hover:block text-xl text-center opacity-0 translate-y-4 transition-opacity duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
                dolore adipisci placeat.
              </p>
            </div>
          </div>
        </div>
        <div className="relative m-6 overflow-hidden group cursor-pointer">
          <img
            src={CampaignImage}
            alt="Campaign"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 w-full p-4 rounded-b-[40px] bg-[rgba(27,27,27,.5)] text-white transition-all duration-500 ease-in-out flex flex-col justify-end group-hover:h-[160px]">
            <div className="flex flex-col justify-end h-full transition-transform duration-500 ease-in-out transform group-hover:translate-y-[-10px]">
              <h1 className="text-4xl text-center mb-2">Campaign</h1>
              <p className="hidden group-hover:block text-xl text-center opacity-0 translate-y-4 transition-opacity duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
                dolore adipisci placeat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
