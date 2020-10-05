<template>
    <v-row class="Signal">
        <v-text-field v-model="model.ticker" disabled class="ticker" label="Ticker" outlined dense></v-text-field>

        <v-text-field v-model="price" disabled class="ticker" label="Trigger price" outlined dense></v-text-field>

        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-icon class="icon" v-if="model.priceStatus === 'above'" large v-on="on" color="green darken-2"
                    >mdi-arrow-up</v-icon
                >
                <v-icon class="icon" v-else-if="model.priceStatus === 'below'" large v-on="on" color="red darken-2"
                    >mdi-arrow-down</v-icon
                >
                <v-icon class="icon" v-else large v-on="on" color="orange darken-2">mdi-tilde</v-icon>
            </template>
            <span>Ticker current price status - above signal, below signal or undetermined</span>
        </v-tooltip>

        <v-sparkline
            class="sparkline"
            v-model="model.sparkline"
            :smooth="10"
            :line-width="4"
            padding="2"
            stroke-linecap="round"
        ></v-sparkline>
    </v-row>
</template>

<style lang="scss" scoped>
.Signal {
    .ticker {
        margin-right: 10px;
    }

    .price {
        margin-right: 10px;
        max-width: 200px;
    }

    .icon {
        height: 40px;
    }

    .sparkline {
        width: 200px;
        height: 40px;
    }
}
</style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';
import { Signal } from '@/types/signals';

@Component({
    components: {},
    mixins: [ModelMixin],
})
export default class SignalRow extends Mixins<ModelMixin<Signal>>(ModelMixin) {
    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    get price() {
        return this.model.price && this.model.price.toFixed ? this.model.price.toFixed(3) : this.model.price;
    }
}
</script>
