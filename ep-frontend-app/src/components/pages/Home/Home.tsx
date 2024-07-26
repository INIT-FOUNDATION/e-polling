import React, { useEffect } from "react";
import { homeService } from "./homeService";
import { useLoader, useLogger, useToast } from "../../../hooks";
import Footer from "../../common/Footer/Footer";
import ContactUs from "../../common/ContactUs/ContactUs";
import LastYearWinner from "../Home/Components/LastYearWinner/LastYearWinner";
import Dates from "../Home/Components/Dates/Dates";
import Categories from "../Categories/Categories";
import WhoCanEnter from "./Components/WhoCanEnter/WhoCanEnter";

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
            <Categories />
            <WhoCanEnter />
            <Dates />
            <LastYearWinner />
            <ContactUs />
            <Footer/>
            </div>
    );
}

export default Home;