<template>
    <v-navigation-drawer app permanent expand-on-hover v-if="user && user.role === 'admin'">
        <drawer-account />

        <v-divider></v-divider>

        <v-list nav dense>
            <v-list-item link v-for="(route, index) in routes" v-bind:key="index" :to="route.url">
                <v-list-item-icon>
                    <v-icon>{{ route.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ route.title }}</v-list-item-title>
            </v-list-item>
        </v-list>

        <template v-slot:append>
            <div class="pa-2">
                <v-btn block @click="handleLogout">Logout</v-btn>
            </div>
        </template>
    </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.v-list-item__title {
    text-transform: capitalize;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DrawerAccount from './DrawerAccount.vue';
import { logout } from '@/store/utils';
import { State } from 'vuex-class';
import { UserInfo } from '@/types/user-info';

@Component({
    components: {
        DrawerAccount,
    },
})
export default class Drawer extends Vue {
    @State('user')
    user!: UserInfo | null;

    get routes() {
        const allRoutes = this.$router.options?.routes;

        if (!allRoutes) {
            return [];
        }

        return allRoutes
            .map(route => {
                const meta = route.meta;

                if (!meta || !meta.showInMenu) {
                    return false;
                }

                return {
                    title: meta.title || route.name,
                    url: route.path,
                    icon: meta.icon,
                };
            })
            .filter(route => !!route);
    }

    private handleLogout() {
        logout(this.$store);
    }
}
</script>
