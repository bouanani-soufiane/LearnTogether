import axios, { AxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";

interface ApiRequestOptions {
    setLoadingValue?: boolean;
    escapeAuthCheck?: boolean;
}

const useApiRequest = (
    options: ApiRequestOptions = { setLoadingValue: true, escapeAuthCheck: false }
) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const makeRequest = useCallback(
        async <T>(config: AxiosRequestConfig): Promise<T> => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios(config);
                if (options.setLoadingValue) {
                    setLoading(false);
                }
                return response.data;
            } catch (error: any) {
                setLoading(false);

                if (!options.escapeAuthCheck && error.response?.status === 401) {
                    localStorage.removeItem("authToken");
                    navigate("/login");
                    throw new Error("Not authorized");
                }

                setError(error.response?.data?.message || "An error occurred");
                throw {
                    message: error.response?.data?.message || "Unknown error",
                    status: error.response?.status,
                };
            }
        },
        [navigate, options]
    );

    return { makeRequest, loading, error };
};

export default useApiRequest;
