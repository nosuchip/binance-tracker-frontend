import axios from 'axios';
import { UserInfo, AuthToken } from '@/types/user-info';
import { Signal } from '@/types/signals';
import { Comment, Post } from '@/types/blog';
import { Paginated } from '@/types/pagination';
import { apiBaseUrl } from '@/config';

export interface QueryParams {
    page?: number;
    perPage?: number;
    filter?: string;
}

export const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    // timeout: 1000,
    // headers: { 'X-Custom-Header': 'foobar' }
});

export function setAuthToken(token: string | null) {
    axiosInstance.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
}

//
// Account
//

export const login = async (email: string, password: string): Promise<{ user: UserInfo; token: AuthToken }> => {
    return axiosInstance.post('/api/account/login', { email, password }).then(({ data }) => {
        return {
            token: data.token,
            user: data.user,
        };
    });
};

export const loadCurrentUser = async (): Promise<{ user: UserInfo; token: AuthToken }> => {
    return axiosInstance.get('/api/account/me').then(({ data }) => {
        return {
            token: data.token,
            user: data.user,
        };
    });
};

//
// Signals
//

export const loadSignals = async ({
    page,
    perPage,
    filter,
    paid,
}: QueryParams & { paid?: boolean }): Promise<Paginated<Signal>> => {
    return axiosInstance.get('/api/signals', { params: { page, perPage, filter, paid } }).then(({ data }) => data);
};

export const loadSignal = async (signalId: string): Promise<{ signal: Signal; comments: Comment[] }> => {
    return axiosInstance.get(`/api/signals/${signalId}`).then(({ data }) => data);
};

export const createSignal = async (signal: Partial<Signal>): Promise<Signal> => {
    return axiosInstance.post(`/api/signals`, signal).then(({ data }) => data);
};

export const updateSignal = async (signal: Partial<Signal>): Promise<Signal> => {
    return axiosInstance.put(`/api/signals/${signal.id}`, signal).then(({ data }) => data);
};

export const deleteSignal = async (signalId: number): Promise<void> => {
    return axiosInstance.delete(`/api/signals/${signalId}`).then(({ data }) => data);
};

export const createSignalComment = async (signalId: number, text: string): Promise<Comment> => {
    return axiosInstance.post(`/api/signals/${signalId}/comment`, { signalId, text }).then(({ data }) => data);
};

export const lostSignalPosts = async (signalId: string): Promise<Paginated<Post>> => {
    return axiosInstance.get(`/api/posts/signal/${signalId}`).then(({ data }) => data);
};

//
// Blog-like
//
