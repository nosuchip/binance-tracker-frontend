import { Store } from 'vuex';
import { State } from '@/types/store/state';
import { mutations } from './types';

export const logout = (store: Store<State>) => {
    store.commit(mutations.SET_AUTH_TOKEN, { token: '' });
    store.commit(mutations.SET_USER, { user: null });
};
