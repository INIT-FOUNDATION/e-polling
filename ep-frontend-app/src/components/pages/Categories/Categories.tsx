import React from "react";

import InfluencerImage from "../../../assets/images/Categories/Influencer.svg";
import AgencyImage from "../../../assets/images/Categories/Agency.svg";
import CampaignImage from "../../../assets/images/Categories/Campaign.svg";

const Categories: React.FC = () => {
  return (
    <div className="p-10 bg-[#F9F3FD]">
      <div className="flex justify-center items-center text-[39.2px] text-[#333333] mb-8">
        Categories
      </div>
      <div className="flex justify-center flex-wrap">
        <div className="relative  m-6  overflow-hidden group cursor-pointer">
          <img
            src={InfluencerImage}
            alt="Influencer"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 w-full p-4 bg-[rgba(27,27,27,.5)] rounded-b-[40px] text-white transition-all ease-in hover:ease-out duration-700 delay-1000 hover:delay-1000  group-hover:h-[160px] flex flex-col justify-end">
            <h1 className="text-4xl text-center mb-2">Influencer</h1>
            <p className="text-xl text-center hidden group-hover:block">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
              dolore adipisci placeat.
            </p>
          </div>
        </div>
        <div className="relative m-6 overflow-hidden group cursor-pointer">
          <img
            src={AgencyImage}
            alt="Agency"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 w-full p-4 bg-[rgba(27,27,27,.5)] rounded-b-[40px] text-white transition-all ease-in hover:ease-out duration-300 delay-300 hover:delay-700 group-hover:h-[160px] flex flex-col justify-end">
            <h1 className="text-4xl text-center mb-2">Agency</h1>
            <p className="text-xl text-center hidden group-hover:block">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
              dolore adipisci placeat.
            </p>
          </div>
        </div>
        <div className="relative m-6 overflow-hidden group cursor-pointer">
          <img
            src={CampaignImage}
            alt="Campaign"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 w-full p-4 bg-[rgba(27,27,27,.5)] rounded-b-[40px] text-white transition-all ease-in hover:ease-out duration-300 delay-300 hover:delay-700 group-hover:h-[160px] flex flex-col justify-end">
            <h1 className="text-4xl text-center mb-2">Campaign</h1>
            <p className="text-xl text-center hidden group-hover:block">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
              dolore adipisci placeat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
