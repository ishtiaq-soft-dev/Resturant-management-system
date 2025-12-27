/**
 * Custom hook for API calls with loading and error states
 */
import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiCall, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiCall();
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

