import { useState, useEffect } from 'react';
import ApiConfig from '../Repository/ApiConfig';

interface UseApiOptions {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
    execute: (...args: any[]) => Promise<T>;
    reset: () => void;
}

/**
 * Hook personnalisé pour les appels API
 * @param apiCall - Fonction qui effectue l'appel API
 * @param options - Options pour le hook
 */
export function useApi<T = any>(
    apiCall: (...args: any[]) => Promise<T>,
    options: UseApiOptions = {}
): UseApiReturn<T> {
    const { immediate = false, onSuccess, onError } = options;
    
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = async (...args: any[]): Promise<T> => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            const result = await apiCall(...args);
            setState(prev => ({ ...prev, data: result, loading: false }));
            
            if (onSuccess) {
                onSuccess(result);
            }
            
            return result;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
            setState(prev => ({ ...prev, error: errorMessage, loading: false }));
            
            if (onError) {
                onError(error);
            }
            
            throw error;
        }
    };

    const reset = () => {
        setState({
            data: null,
            loading: false,
            error: null,
        });
    };

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [immediate]);

    return {
        ...state,
        execute,
        reset,
    };
}

/**
 * Hook pour les listes avec pagination
 */
export function useApiList<T = any>(
    apiCall: (page: number, ...args: any[]) => Promise<{ data: T[]; total: number; current_page: number; last_page: number }>,
    options: UseApiOptions = {}
) {
    const [page, setPage] = useState(1);
    const [allData, setAllData] = useState<T[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        currentPage: 1,
        lastPage: 1,
    });

    const { data, loading, error, execute, reset } = useApi(
        async (...args: any[]) => {
            const result = await apiCall(page, ...args);
            return result;
        },
        {
            ...options,
            onSuccess: (result) => {
                if (page === 1) {
                    setAllData(result.data);
                } else {
                    setAllData(prev => [...prev, ...result.data]);
                }
                
                setPagination({
                    total: result.total,
                    currentPage: result.current_page,
                    lastPage: result.last_page,
                });
                
                if (options.onSuccess) {
                    options.onSuccess(result);
                }
            },
        }
    );

    const loadMore = () => {
        if (page < pagination.lastPage && !loading) {
            setPage(prev => prev + 1);
        }
    };

    const refresh = () => {
        setPage(1);
        setAllData([]);
        setPagination({ total: 0, currentPage: 1, lastPage: 1 });
        reset();
    };

    useEffect(() => {
        if (page > 0) {
            execute();
        }
    }, [page]);

    return {
        data: allData,
        loading,
        error,
        pagination,
        loadMore,
        refresh,
        hasMore: page < pagination.lastPage,
    };
}

/**
 * Hook pour la gestion des formulaires avec API
 */
export function useApiForm<T = any>(
    apiCall: (data: any) => Promise<T>,
    options: UseApiOptions = {}
) {
    const { data, loading, error, execute, reset } = useApi(apiCall, options);
    const [formData, setFormData] = useState<any>({});

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        return execute(formData);
    };

    const updateFormData = (updates: any) => {
        setFormData((prev: any) => ({ ...prev, ...updates }));
    };

    const resetForm = () => {
        setFormData({});
        reset();
    };

    return {
        data,
        loading,
        error,
        formData,
        handleSubmit,
        updateFormData,
        resetForm,
    };
}

export default useApi;
