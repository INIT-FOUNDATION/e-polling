import React from 'react';
import "./Header.scss";
import star_influencer_award from "../../../assets/images/Header/star_influencer_award.svg";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto py-4 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          {/* Logo */}
          <img src={star_influencer_award} alt="Star Influencer Awards" className="h-8 md:h-12 mr-4" />
          <h1 className="text-xl md:text-2xl font-bold">Star Influencer Awards</h1>
        </div>
        <nav className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-7">
          <a href="#" className="text-gray-700 hover:text-blue-500">Categories</a>
          <a href="#" className="text-gray-700 hover:text-blue-500">Last Year's Winners</a>
          <a href="#" className="text-gray-700 hover:text-blue-500">Submit Nomination</a>
          <a href="#" className="text-gray-700 hover:text-blue-500">Contact</a>
          <button className="login-button text-white font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700">
            Log In
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
