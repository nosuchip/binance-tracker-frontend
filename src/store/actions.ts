import { actions, mutations } from './types';
import { ActionState } from '@/types/store/state';
import router from '@/router';
import * as api from '@/modules/api';
import { Credentials } from '@/types/user-info';
import { Dictionary } from '@/types/base';
import { Paginated } from '@/types/pagination';
import { Signal } from '@/types/signals';

const login = async ({ commit }: ActionState, { username, password }: Credentials) => {
    console.log('ACTION login', username, password);
    commit(mutations.LOADING, { loading: true });
    commit(mutations.SET_AUTH_TOKEN, { token: null });

    try {
        const { token, user } = await api.login(username, password);
        commit(mutations.SET_AUTH_TOKEN, { token });
        commit(mutations.SET_USER, { user });

        return router.push({ name: 'dashboard' });
    } catch (error) {
        commit(mutations.SET_AUTH_TOKEN, { token: null });
        commit(mutations.SET_USER, { user: null });

        console.error('Login error');
        console.error(error);
    } finally {
        commit(mutations.LOADING, { loading: false });
    }
};

const logout = ({ commit }: ActionState) => {
    commit(mutations.SET_AUTH_TOKEN, { token: null });
    commit(mutations.SET_USER, { user: null });

    router.push({ name: 'login' }).catch(() => {
        /* Do nothing */
    });
};

const checkAuthToken = async (
    { state, commit }: ActionState,
    { next, params }: { next?: string; params?: Dictionary<string> },
) => {
    console.log('ACTION loadUserInfo');
    commit(mutations.LOADING, { loading: true, message: 'Authenticating...' });

    const { token } = state;
    api.setAuthToken(token);

    try {
        if (!token) {
            return router.push({ name: 'login' }).catch(() => {
                /* Do nothing */
            });
        }

        const { user, token: newToken } = await api.loadCurrentUser();
        commit(mutations.SET_USER, { user });
        commit(mutations.SET_AUTH_TOKEN, { token: newToken });

        router.push({ name: next || 'dashboard', params: params || {} }).catch(() => {
            /* Do nothing */
        });
    } catch (error) {
        commit(mutations.SET_AUTH_TOKEN, { token: null });
        commit(mutations.SET_USER, { user: null });

        console.error('Check auth user error');
        console.error(error);

        return router.push({ name: 'login' }).catch(() => {
            /* Do nothing */
        });
    } finally {
        commit(mutations.LOADING, { loading: false });
    }
};

const loadSignals = async (
    { commit }: ActionState,
    { page, perPage, filter }: api.QueryParams,
): Promise<Paginated<Signal> | undefined> => {
    console.log('ACTION loadUserInfo');
    commit(mutations.LOADING, { loading: true, message: 'Authenticating...' });
    try {
        const result = await api.loadSignals({ page, perPage, filter });
        commit(mutations.SET_SIGNALS, { signals: result.data });
        commit(mutations.SET_AVAILABLE_SIGNALS, { available: result.available });

        return result;
    } catch (error) {
        console.error('Check auth user error');
        console.error(error);
    } finally {
        commit(mutations.LOADING, { loading: false });
    }
};

export default {
    [actions.LOGIN]: login,
    [actions.LOGOUT]: logout,
    [actions.CHECK_AUTH_TOKEN]: checkAuthToken,
    [actions.LOAD_SIGNALS]: loadSignals,
};
