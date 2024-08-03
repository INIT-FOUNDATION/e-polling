import React from "react";
import Homepage from "../../../../../assets/images/HeroSection/Homepage.svg";
import "./HeroSection.scss";

const HeroSection: React.FC = () => {
    return (
        <div
            className="bg-cover bg-center h-screen flex items-center justify-center"
            style={{ backgroundImage: `url(${Homepage})` }}
        >
            <div className="container mx-auto text-center pb-8 px-4 md:px-8 ">
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-700 pb-2 md:pb-4">
                        Star Influencer
                    </h1>
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-700">
                        Awards
                    </h1>
                </div>
                <p className="text-base md:text-lg lg:text-xl mt-4 text-gray-700 pt-6 md:pt-12">
                    Recognizing the industry's top talent, management teams, and influencer
                    <br className="hidden md:block"/> marketing campaigns.
                </p>
                <button className="bg-blue-500 btn hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    View Last Year's Winners
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
