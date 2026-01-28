export interface PaginationInfo {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    pagination?: PaginationInfo;
}
