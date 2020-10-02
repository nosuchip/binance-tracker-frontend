<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div class="d-flex align-center">
                <v-img
                    alt="BinanceTracker"
                    contain
                    src="@/assets/logo.png"
                    transition="scale-transition"
                    height="45"
                    width="50"
                />
                <div class="text-h5"></div>
            </div>

            <v-spacer></v-spacer>
            <v-btn v-if="!isLoggedOn" :to="{ name: 'login' }">Login</v-btn>
            <v-btn v-if="isLoggedOn" @click="handleLogout">Logout</v-btn>
        </v-app-bar>

        <drawer v-if="!hideControls" />

        <v-main>
            <router-view></router-view>
        </v-main>

        <loader></loader>
    </v-app>
</template>

<style lang="scss">
@import '../node_modules/typeface-roboto/index.css';
@import '../node_modules/@mdi/font/css/materialdesignicons.css';
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

import Loader from '@/components/Loader.vue';
import Drawer from '@/components/app/Drawer.vue';
import { logout } from '@/store/utils';

@Component({
    components: {
        Loader,
        Drawer,
    },
})
export default class App extends Vue {
    @Getter('isLoggedOn')
    readonly isLoggedOn!: boolean;

    get hideControls() {
        return !this.isLoggedOn || this.$route.name === 'login';
    }

    handleLogout() {
        logout(this.$store);
    }
}
</script>
