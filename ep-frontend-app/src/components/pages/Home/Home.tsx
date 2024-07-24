import React, { useEffect } from "react";
import { homeService } from "./homeService";
import { useLoader, useLogger, useToast } from "../../../hooks";

const Home: React.FC = () => {

    const { log } = useLogger();
    const { showToast } = useToast();
    const { showLoader } = useLoader();

    useEffect(() => {
        try {
            // const response = homeService.getHealthCheck();
            // log('info', 'Home', response);
            showToast('Success', 'Success', 'success');
            showLoader();
        } catch (error) {
            log('error', 'Home', error);
        }

    }, []);

    return (
        <h1 className="text-3xl font-bold underline">
            Hello world!
        </h1>
    );
}

export default Home;