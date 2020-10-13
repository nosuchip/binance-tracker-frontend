<template>
    <v-container class="SignalView"> Signal view {{ $route.params.signalId }} </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class SignalView extends Vue {}
</script>
