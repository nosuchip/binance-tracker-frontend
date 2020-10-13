<template>
    <v-row class="SignalOrder">
        <v-col cols="12" sm="1" class="d-flex justify-center align-center order pb-0">
            {{ order }}
        </v-col>
        <v-col cols="12" sm="4" class="pb-0">
            <v-text-field
                v-model.number="model.price"
                type="number"
                :rules="requiredRules"
                label="Price"
                required
                hide-details
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2" class="pb-0">
            <v-text-field
                v-model.number="model.volume"
                type="number"
                :rules="requiredRules"
                label="Volume"
                required
                hide-details
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" class="pb-0">
            <v-text-field v-model="model.comment" label="Comment" hide-details></v-text-field>
        </v-col>
        <v-col cols="12" sm="1" class="pb-0 d-flex justify-center align-center">
            <v-btn icon small @click="onDelete">
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

    @Prop({ type: Function, required: true })
    onDelete!: () => void;
}
</script>
