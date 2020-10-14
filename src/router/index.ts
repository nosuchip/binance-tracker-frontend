import Vue from 'vue';
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Account/Login.vue';
import SignalsList from '../views/Admin/SignalsList.vue';
import SignalEdit from '../views/Admin/SignalEdit.vue';
import SignalView from '../views/SignalView.vue';
import SignalsUpload from '../views/Admin/SignalsUpload.vue';

import store from '@/store';
import { actions } from '@/store/types';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            title: 'Dashboard',
            showInMenu: true,
            icon: 'mdi-view-dashboard',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: 'Login',
        },
    },

    {
        path: '/signals',
        name: 'signals-list',
        component: SignalsList,
        meta: {
            auth: true,
            showInMenu: true,
            icon: 'mdi-pencil-box-multiple-outline',
            title: 'Signals',
        },
    },
    {
        path: '/signals/upload',
        name: 'signals-upload',
        component: SignalsUpload,
        meta: {
            auth: true,
            showInMenu: true,
            icon: 'mdi-table-arrow-up',
            title: 'Signals CSV upload',
        },
    },
    {
        path: '/signal/:signalId',
        name: 'signal-view',
        component: SignalView,
        meta: {
            auth: false,
            title: 'Signal',
        },
    },
    {
        path: '/signals/:signalId',
        name: 'signal-edit',
        component: SignalEdit,
        meta: {
            auth: true,
            title: 'Signal',
        },
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(async (to: Route, from: Route, next: NavigationGuardNext) => {
    console.log(`Router: to ${to.name}, params: ${JSON.stringify(to.params)}`);

    const title = to.meta && to.meta.title;
    if (title) {
        document.title = `Binance tracker :: ${title}`;
    } else {
        document.title = `Binance tracker`;
    }

    const authRequired = to.meta && to.meta.auth;

    if (!authRequired) {
        return next();
    }

    if (!store.getters.isLoggedOn) {
        await store.dispatch(actions.CHECK_AUTH_TOKEN, { next: to.name, params: to.params });
    }

    if (!store.getters.isLoggedOn) {
        return next({ name: 'login' });
    }

    return next();
});

export default router;
