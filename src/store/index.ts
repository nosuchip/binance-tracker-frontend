import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { State } from '@/types/store/state';
import { state } from './state';
import actions from './actions';
import mutations from './mutations';
import * as api from '@/modules/api';
import { mutations as mutationTypes } from './types';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store<State>({
    state,
    mutations,
    actions,
    getters,
    plugins: [
        createPersistedState({
            paths: ['token'],
        }),
    ],
});

store.subscribe((mutation, state) => {
    if (mutation.type === mutationTypes.SET_AUTH_TOKEN) {
        api.setAuthToken(state.token);
    }
});

export default store;
