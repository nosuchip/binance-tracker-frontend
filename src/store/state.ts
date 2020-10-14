import { State } from '@/types/store/state';

export const state: State = {
    loading: false,
    loadingMessage: '',

    user: null,
    token: null,

    signals: [],

    available: []
};
