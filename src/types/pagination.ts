export interface Pagination {
    page: number;
    prev: number;
    next: number;
    perPage: number;
    total: number;

    hasNext: boolean;
    hasPrev: boolean;
}

export interface Paginated<T> {
    pagination: Pagination;
    data: T[];
}

export const DEFAULT_PAGE_SIZE = 10;
