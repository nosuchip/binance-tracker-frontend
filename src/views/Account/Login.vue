<template>
    <v-container class="Account--Login fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Login form</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                label="Login"
                                name="login"
                                prepend-icon="mdi-account"
                                type="text"
                                v-model="username"
                            ></v-text-field>

                            <v-text-field
                                id="password"
                                label="Password"
                                name="password"
                                prepend-icon="mdi-lock"
                                type="password"
                                v-model="password"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="handleLogin">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { actions } from '@/store/types';
import { LoginActionType } from '@/types/store/actions';

@Component({
    components: {},
})
export default class Login extends Vue {
    @Action(actions.LOGIN)
    login!: LoginActionType;

    private username = '';
    private password = '';

    handleLogin() {
        this.login({ username: this.username, password: this.password });
    }
}
</script>
