<template>
    <v-row class="SignalData">
        <v-col cols="12">
            <v-text-field
                v-model="model.ticker"
                :rules="requiredRules"
                label="Ticker"
                required
                hide-details
            ></v-text-field>
        </v-col>

        <v-col cols="12">
            <v-select label="Type" v-model="model.type" :items="typesOptions" hide-details></v-select>
        </v-col>

        <v-col cols="12">
            <v-select label="Risk" v-model="model.risk" :items="riskOptions" hide-details></v-select>
        </v-col>

        <v-col cols="12">
            <v-select label="Terms" v-model="model.term" :items="termsOptions" hide-details></v-select>
        </v-col>

        <v-col cols="12">
            <v-text-field
                v-model.number="model.volume"
                label="Volume"
                required
                hide-details
                append-icon="mdi-information-outline"
                @click:append.stop="showVolumeInfo = true"
            ></v-text-field>

            <popup v-model="showVolumeInfo" title="Recommended volume" text="Blah-blah-blah" />
        </v-col>

        <v-col cols="12">
            <v-checkbox v-model="model.paid" label="Paid signal" hide-details></v-checkbox>
        </v-col>

        <v-col cols="12">
            <v-checkbox v-model="model.commentable" label="Comments" hide-details></v-checkbox>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';
import { Signal } from '@/types/signals';
import Popup from '@/components/Popup.vue';

@Component({
    components: { Popup },
    mixins: [ModelMixin],
})
export default class SignalData extends Mixins<ModelMixin<Signal>>(ModelMixin) {
    private showVolumeInfo = false;

    private requiredRules = [(s: string) => !!s || 'Field is required'];

    private readonly typesOptions = [
        { value: 'long', text: 'Long' },
        { value: 'short', text: 'Short' },
    ];

    private readonly riskOptions = [
        { value: 'high', text: 'High' },
        { value: 'medium', text: 'Medium' },
        { value: 'low', text: 'Low' },
    ];

    private readonly termsOptions = [
        { value: 'short', text: 'Short' },
        { value: 'medium', text: 'Medium' },
        { value: 'long', text: 'Long' },
    ];
}
</script>
