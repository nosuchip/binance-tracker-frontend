import { mutations } from './types';
import { State } from '@/types/store/state';
import { UserInfo } from '@/types/user-info';
import { Signal } from '@/types/signals';

export default {
    [mutations.LOADING]: (state: State, { loading, message }: { loading: boolean; message?: string }) => {
        state.loading = loading;
        state.loadingMessage = message;
    },

    [mutations.SET_AUTH_TOKEN]: (state: State, { token }: { token: string | null }) => {
        state.token = token;
    },

    [mutations.SET_USER]: (state: State, { user }: { user: UserInfo | null }) => {
        state.user = user;
    },

    [mutations.SET_SIGNALS]: (state: State, { signals }: { signals: Signal[] }) => {
        state.signals = signals.map(signal => ({
            sparkline: new Array(30).fill(0),
            ...signal,
        }));
    },

    [mutations.SET_AVAILABLE_SIGNALS]: (state: State, { available }: { available: number[] }) => {
        state.available = available;
    },
};
