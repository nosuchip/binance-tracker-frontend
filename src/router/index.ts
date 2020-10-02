import Vue from 'vue';
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Account/Login.vue';
import SignalsList from '../views/Admin/SignalsList.vue';
import SignalEdit from '../views/Admin/SignalEdit.vue';
// import DeviceList from '../views/DeviceList.vue';
// import Device from '../views/Device.vue';
// import PricingPlans from '../views/PricingPlans.vue';
// import PricingPlan from '../views/PricingPlan.vue';
// import PricingGroups from '../views/PricingGroups.vue';
// import PricingGroup from '../views/PricingGroup.vue';
// import PricingUsers from '../views/PricingUsers.vue';
// import PricingUser from '../views/PricingUser.vue';
// import PricingResolved from '../views/PricingResolved.vue';

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
        path: '/signals/:signalId',
        name: 'signal-edit',
        component: SignalEdit,
        meta: {
            auth: true,
            title: 'Signal',
        },
    },
    // {
    //     path: '/devices',
    //     name: 'devices',
    //     component: DeviceList,
    //     meta: {
    //         auth: true,
    //         showInMenu: true,
    //         icon: 'mdi-cellphone-wireless',
    //         title: 'Devices',
    //     },
    // },
    // {
    //     path: '/device/:deviceId/',
    //     name: 'device',
    //     component: Device,
    //     meta: {
    //         auth: true,
    //         title: 'Device',
    //     },
    // },
    // {
    //     path: '/subscriptions/price/plans',
    //     name: 'pricing-plans',
    //     component: PricingPlans,
    //     meta: {
    //         auth: true,
    //         showInMenu: true,
    //         title: 'Pricing Plans',
    //         icon: 'mdi-cash',
    //     },
    // },
    // {
    //     path: '/subscriptions/price/plans/:planId',
    //     name: 'pricing-plan',
    //     component: PricingPlan,
    //     meta: {
    //         auth: true,
    //         showInMenu: false,
    //         title: 'Pricing Plan',
    //     },
    // },
    // {
    //     path: '/subscriptions/price/groups',
    //     name: 'pricing-groups',
    //     component: PricingGroups,
    //     meta: {
    //         auth: true,
    //         showInMenu: true,
    //         title: 'Pricing Groups',
    //         icon: 'mdi-cash-multiple',
    //     },
    // },
    // {
    //     path: '/subscriptions/price/groups/:groupId',
    //     name: 'pricing-group',
    //     component: PricingGroup,
    //     meta: {
    //         auth: true,
    //         showInMenu: false,
    //         title: 'Pricing Group',
    //     },
    // },
    // {
    //     path: '/subscriptions/price/users',
    //     name: 'pricing-users',
    //     component: PricingUsers,
    //     meta: {
    //         auth: true,
    //         showInMenu: true,
    //         title: 'Pricing Users',
    //         icon: 'mdi-cash-usd',
    //     },
    // },
    // {
    //     path: '/subscriptions/price/users/:userId',
    //     name: 'pricing-user',
    //     component: PricingUser,
    //     meta: {
    //         auth: true,
    //         showInMenu: false,
    //         title: 'Pricing User',
    //     },
    // },
    // {
    //     path: '/subscriptions/price/resolved',
    //     name: 'pricing-resolved',
    //     component: PricingResolved,
    //     meta: {
    //         auth: true,
    //         showInMenu: true,
    //         title: 'Resolved prices',
    //         icon: 'mdi-equalizer',
    //     },
    // },
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
