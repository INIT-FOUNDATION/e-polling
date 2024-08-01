import React, { useEffect } from "react";
import { homeService } from "./homeService";
import { useLoader, useLogger, useToast } from "../../../hooks";
import Footer from "../../common/Footer/Footer";

import LastYearWinner from "../Home/Components/LastYearWinner/LastYearWinner";

import Categories from "../Categories/Categories";
import WhoCanEnter from "./Components/WhoCanEnter/WhoCanEnter";
import StarInfluenceAwards from "./Components/StarInfluencerAwards/StarInfluencerAwards";

import Dates from "./Components/Dates/Dates";
import ContactUs from "../../common/ContactUs/ContactUs";
import HeroSection from "./Components/HeroSection/HeroSection";

const Home: React.FC = () => {
  // const { log } = useLogger();
  // const { showToast } = useToast();
  // const { showLoader } = useLoader();

  // useEffect(() => {
  //     try {
  //         // const response = homeService.getHealthCheck();
  //         // log('info', 'Home', response);
  //         showToast('Success', 'Success', 'success');
  //         showLoader();
  //     } catch (error) {
  //         log('error', 'Home', error);
  //     }

  // }, []);

  return (
    <div>
      <HeroSection />
      <StarInfluenceAwards />
      <Categories />
      <WhoCanEnter />
      <Dates />
      <LastYearWinner />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
