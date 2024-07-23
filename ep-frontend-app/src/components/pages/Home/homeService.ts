import { ApiResponse } from "../../../api";
import api from "../../../api/axiosConfig";

export const homeService = {
    getHealthCheck: async (): Promise<ApiResponse<any>> => {
        return await api.get('/api/v1/auth/health');
    }
}