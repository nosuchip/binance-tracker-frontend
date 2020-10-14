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
import ws from '@/modules/ws';

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
    const { type, payload } = mutation;

    if (type === mutationTypes.SET_AUTH_TOKEN) {
        console.log(`Mutation ${type} subscription`);
        api.setAuthToken(state.token);
    } else if (type === mutationTypes.SET_AVAILABLE_SIGNALS) {
        const { available } = payload;
        console.log(
            `Mutation ${mutationTypes.SET_AVAILABLE_SIGNALS} subscription with available signals ${available.join(
                ',',
            )}`,
        );
        ws.send({ event: 'subscribe_signals', payload: { signals: available } });
        ws.send({ event: 'subscribe_sparklines', payload: { signals: available } });

        Vue.toasted.success('Subscribed to signals');
    }
});

export default store;
