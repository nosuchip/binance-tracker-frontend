<template>
    <v-row class="SignalOrder">
        <v-col cols="12" sm="1" class="d-flex justify-center align-center order">
            {{ order }}
        </v-col>
        <v-col cols="12" sm="4">
            <v-text-field
                v-model.number="model.price"
                type="number"
                :rules="requiredRules"
                :label="$t('Price')"
                required
                hide-details
                :disabled="disabled"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
            <v-text-field
                v-model.number="volume"
                type="number"
                :rules="requiredRules"
                :label="$t('Volume')"
                suffix="%"
                required
                hide-details
                :disabled="disabled"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
            <v-text-field
                v-model="model.comment"
                :label="$t('Comment')"
                hide-details
                :disabled="disabled"
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="1" class="pb-0 d-flex justify-center align-center">
            <v-btn icon small @click="onDelete" :disabled="disabled">
                <v-icon dark>
                    mdi-trash-can-outline
                </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<style lang="scss" scoped>
.order {
    font-size: 16px;
}
</style>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';
import { Order } from '@/types/signals';

@Component({
    components: {},
    mixins: [ModelMixin],
})
export default class SignalOrder extends Mixins<ModelMixin<Order>>(ModelMixin) {
    private requiredRules = [(s: string) => !!s || 'Field is required'];

    @Prop({ type: Number, required: true })
    order!: number;

    @Prop({ type: Boolean, required: false })
    disabled!: boolean;

    @Prop({ type: Function, required: true })
    onDelete!: () => void;

    get volume() {
        return this.model.volume * 100;
    }

    set volume(value) {
        this.model.volume = value / 100;
    }
}
</script>
