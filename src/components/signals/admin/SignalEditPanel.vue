<template>
    <v-card class="SignalEditPanel">
        <v-card-title>
            <span class="SignalEditPanel--title">{{ title }}</span>
            <v-spacer></v-spacer>
            <span class="SignalEditPanel--add-button" v-if="onAdd">
                <v-btn text color="blue lighten-3" @click="onAdd">{{ $t('+ Add more') }}</v-btn>
            </span>
        </v-card-title>
        <v-card-text>
            <slot></slot>

            <div class="text-caption red--text lighten-2" v-if="error" v-html="error" color="error"></div>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class SignalEditPanel extends Vue {
    @Prop({ type: String, required: false })
    title!: string;

    @Prop({ type: String, required: false })
    error!: string;

    @Prop({ type: Function, required: false })
    onAdd!: () => void;
}
</script>
