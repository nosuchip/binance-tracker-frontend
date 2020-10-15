import Vue from 'vue';
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router';
import Login from '../views/Account/Login.vue';
import AdminDashboard from '../views/Admin/Dashboard.vue';
import AdminSignalEdit from '../views/Admin/SignalEdit.vue';
import AdminSignalsUpload from '../views/Admin/SignalsUpload.vue';

import store from '@/store';
import { actions } from '@/store/types';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: 'Login',
        },
    },
    {
        path: '/',
        name: 'dashboard',
        component: AdminDashboard,
        meta: {
            auth: true,
            title: 'Dashboard',
            showInMenu: true,
            icon: 'mdi-view-dashboard',
        },
    },
    {
        path: '/signals/upload',
        name: 'signals-upload',
        component: AdminSignalsUpload,
        meta: {
            auth: true,
            showInMenu: true,
            icon: 'mdi-table-arrow-up',
            title: 'Signals CSV upload',
        },
    },
    {
        path: '/signals/:signalId',
        name: 'signal-edit',
        component: AdminSignalEdit,
        meta: {
            auth: true,
            title: 'Signal edit',
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
