import React, { useEffect } from "react";
import { homeService } from "./homeService";
import { useLoader, useLogger, useToast } from "../../../hooks";
import Footer from "../../common/Footer/Footer";
import ContactUs from "../../common/ContactUs/ContactUs";
import LastYearWinners from "../LastYearWinners/LastYearWinners";
import Dates from "../Dates/Dates";
import Categories from "../Categories/Categories";

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
            <Dates />
            <LastYearWinners />
            <ContactUs />
            <Footer/>
            </div>
    );
}

export default Home;