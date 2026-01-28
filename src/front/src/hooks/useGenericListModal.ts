import { useState, useCallback } from 'react';
import type { SearchParams, ColumnConfig, GenericListModalProps } from '../components/modals/GenericListModal';
import type { PaginationInfo } from '../interfaces';

export interface ModalEntityConfig<T, TFormValues = any> {
    key: string;
    title: string;
    columns: ColumnConfig<T>[];
    fetchService: (params: SearchParams) => Promise<{
        data: T[];
        pagination?: PaginationInfo;
    }>;
    defaultSearchParams?: Partial<SearchParams>;
    mapToFormValues: (item: T, currentValues: TFormValues) => Partial<TFormValues>;
    clearFormValues: (currentValues: TFormValues) => Partial<TFormValues>;
    messages?: {
        empty?: string;
        searchEmpty?: string;
    };
    searchPlaceholder?: string;
    searchMinLength?: number;
    autoLoad?: boolean;
    getContextParams?: (formValues: TFormValues) => Record<string, any>;
}

export interface UseGenericListModalReturn<T> {
    isOpen: boolean;
    isLoading: boolean;
    data: T[];
    pagination: PaginationInfo;
    currentConfig: ModalEntityConfig<T> | null;
    openModal: (configKey: string, additionalParams?: Record<string, any>) => Promise<void>;
    closeModal: () => void;
    handleSearch: (params: SearchParams) => Promise<void>;
    handlePageChange: (page: number) => void;
    handleSelect: (item: T) => void;
    handleClear: (configKey: string) => void;
    getModalProps: () => GenericListModalProps<T>;
}

export function useGenericListModal<T, TFormValues>(
    configs: Record<string, ModalEntityConfig<T, TFormValues>>,
    formik: { values: TFormValues; setValues: (fn: (prev: TFormValues) => TFormValues) => void; setFieldValue?: (field: string, value: any) => void },
    showNotification?: (title: string, message: string, type: string) => void
): UseGenericListModalReturn<T> {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<T[]>([]);
    const [currentConfigKey, setCurrentConfigKey] = useState<string | null>(null);
    const [contextParams, setContextParams] = useState<Record<string, any>>({});
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0
    });

    const currentConfig = currentConfigKey ? configs[currentConfigKey] : null;

    const fetchData = useCallback(async (params: SearchParams, config: ModalEntityConfig<T, TFormValues>, extraContext: Record<string, any> = {}) => {
        setIsLoading(true);
        try {
            // Get context params from form
            const formParams = config.getContextParams ? config.getContextParams(formik.values) : {};

            const mergedParams = {
                ...config.defaultSearchParams,
                ...formParams,
                ...extraContext,
                ...params
            };

            const response = await config.fetchService(mergedParams);
            setData(response.data ?? []);
            if (response.pagination) {
                setPagination(response.pagination);
            }
        } catch (error: any) {
            showNotification?.('Erro', error.message || `Erro ao carregar ${config.title}`, 'danger');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [formik.values, showNotification]);

    const openModal = useCallback(async (configKey: string, additionalParams: Record<string, any> = {}) => {
        const config = configs[configKey];
        if (!config) {
            console.error(`Config não encontrada: ${configKey}`);
            return;
        }
        setCurrentConfigKey(configKey);
        setContextParams(additionalParams);
        setIsOpen(true);
        if (config.autoLoad !== false) {
            await fetchData({ page: 1, limit: 10 }, config, additionalParams);
        }
    }, [configs, fetchData]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setCurrentConfigKey(null);
        setData([]);
    }, []);

    const handleSearch = useCallback(async (params: SearchParams) => {
        if (!currentConfig) return;
        await fetchData(params, currentConfig, contextParams);
    }, [currentConfig, fetchData, contextParams]);

    const handlePageChange = useCallback((page: number) => {
        if (!currentConfig) return;
        handleSearch({ page, limit: pagination.pageSize });
    }, [currentConfig, handleSearch, pagination.pageSize]);

    const handleSelect = useCallback((item: T) => {
        if (!currentConfig) return;

        // Use setValues with functional update to merge
        formik.setValues((prev) => ({
            ...prev,
            ...currentConfig.mapToFormValues(item, prev)
        }));

        closeModal();
    }, [currentConfig, formik, closeModal]);

    const handleClear = useCallback((configKey: string) => {
        const config = configs[configKey];
        if (!config) return;

        formik.setValues((prev) => ({
            ...prev,
            ...config.clearFormValues(prev)
        }));
    }, [configs, formik]);

    const getModalProps = useCallback(() => ({
        isOpen,
        onClose: closeModal,
        title: currentConfig?.title ? `Selecionar ${currentConfig.title}` : 'Selecionar',
        columns: currentConfig?.columns ?? [],
        data,
        isLoading,
        searchPlaceholder: currentConfig?.searchPlaceholder ?? 'Pesquise...',
        searchMinLength: currentConfig?.searchMinLength ?? 3,
        onSearch: handleSearch,
        onItemSelect: handleSelect,
        pagination,
        onPageChange: handlePageChange,
        emptyMessage: currentConfig?.messages?.empty ?? 'Nenhum registro encontrado',
        searchEmptyMessage: currentConfig?.messages?.searchEmpty ?? 'Nenhum resultado encontrado'
    }), [isOpen, closeModal, currentConfig, data, isLoading, handleSearch, handleSelect, pagination, handlePageChange]);

    return {
        isOpen,
        isLoading,
        data,
        pagination,
        currentConfig,
        openModal,
        closeModal,
        handleSearch,
        handlePageChange,
        handleSelect,
        handleClear,
        getModalProps
    };
}
