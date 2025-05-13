import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetCall } from '@/app/api-config/ApiKit';
import { useAppContext } from '@/layout/AppWrapper';


const useFetchDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const { setLoading, setAlert } = useAppContext();


    const fetchDepartments = useCallback(async () => {

        setLoading(true);

        try {

            const response = await GetCall('/company/department');
            setDepartments(response.data);

        } catch (error) {

            setAlert('error', 'Failed to fetch departments');

        } finally {

            setLoading(false);
        }

    }, []);

    // memoization
    const memoizedDepartments = useMemo(() => departments, [departments]);

    useEffect(() => {
            fetchDepartments();
    }, []);

    return { departments: memoizedDepartments, fetchDepartments };
};

export default useFetchDepartments;