<template>
    <v-list v-if="user">
        <v-list-item class="px-2">
            <v-list-item-avatar>
                <gravatar :email="user.email" defaultImage="mp" :size="100" />
            </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
            <v-list-item-content>
                <v-list-item-title class="title">{{ user.name }} [{{ user.role }}]</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
import { UserInfo } from '@/types/user-info';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Gravatar from 'vue-gravatar';

@Component({
    components: {
        Gravatar,
    },
})
export default class Drawer extends Vue {
    @State('user')
    user!: UserInfo;
}
</script>
