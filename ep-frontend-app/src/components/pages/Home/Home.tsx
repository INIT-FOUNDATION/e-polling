import React, { useEffect } from "react";
import { homeService } from "./homeService";
import { useLoader, useLogger, useToast } from "../../../hooks";
import Footer from "../../common/Footer/Footer";

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
        <h1>
            Hello world!
            <Footer/>
        </h1>
    );
}

export default Home;