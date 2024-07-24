import React from "react";
import starInfluence from "../../../assets/images/Footer/starInfluence.svg";

import fb_icon from "../../../assets/images/Footer/fb_icon.svg";
import youtube_icon from "../../../assets/images/Footer/youtube_icon.svg";
import linkedin_icon from "../../../assets/images/Footer/linkedin_icon.svg";
import insta_icon from "../../../assets/images/Footer/insta_icon.svg";
import twitter_icon from "../../../assets/images/Footer/twitter_icon.svg";
import tiktok_icon from "../../../assets/images/Footer/tiktok_icon.svg";

const Footer: React.FC = () => {
  return (
    <div className="py-4 px-10 bg-light-theme">
      <div className="flex flex-wrap">
        <div className="w-full md:w-8/12 lg:w-9/12 flex flex-col px-4">
          <img src={starInfluence} alt="icon" className="w-80 mr-2" />
          <div className="text-[21px] fw-500 mt-5 text-gray-600">
            “Appreciating the talent of people with a special spark”
          </div>
          <div className="footer-label card-label fw-500 mt-5 flex space-x-4">
            <img src={fb_icon} alt="Facebook icon" className=" w-8 h-8" />
            <img src={twitter_icon} alt="Twitter icon" className=" w-8 h-8" />
            <img src={insta_icon} alt="Instagram icon" className=" w-8 h-8" />
            <img src={linkedin_icon} alt="LinkedIn icon" className=" w-8 h-8" />
            <img src={youtube_icon} alt="YouTube icon" className=" w-8 h-8" />
            <img src={tiktok_icon} alt="TikTok icon" className=" w-8 h-8" />
          </div>
        </div>
        <div className="w-full md:w-4/12 lg:w-3/12 mt-2 mb-2 md:pl-10 lg:pl-16">
          <div className="font-medium mb-2 text-gray-700 text-[21px]">
            Important Links
          </div>
          <div className="flex items-start">
            <span className="font-normal text-gray-700 text-[13.5px]">
              Submit a Nomination
            </span>
          </div>
          <div className="flex items-start my-2">
            <span className="font-normal text-gray-700 text-[13.5px]">
              Categories
            </span>
          </div>
          <div className="flex items-start my-2">
            <span className="font-normal text-gray-700 text-[13.5px]">
              Judges
            </span>
          </div>
          <div className="flex items-start my-2">
            <span className="font-normal text-gray-700 text-[13.5px]">
              Last Year’s Winners
            </span>
          </div>
          <div className="flex items-start my-2">
            <span className="font-normal text-gray-700 text-[13.5px]">
              Contact
            </span>
          </div>
        </div>

        <div className="w-full border-t pb-1"></div>

        <div className="w-full flex justify-center items-center">
          <span className="text-secondary text-[13.5px] text-center">
            Copyright © 2024 Star Influencer Awards. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
