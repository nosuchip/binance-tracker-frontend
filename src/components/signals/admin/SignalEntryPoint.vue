<template>
    <v-row class="SignalEntryPoint">
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
                dense
                hide-details
            ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" class="pb-0 pr-0">
            <v-text-field v-model="model.comment" dense label="Comment" hide-details></v-text-field>
        </v-col>
        <v-col cols="12" sm="1" class="pb-0 pl-0 d-flex justify-center align-center">
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
import { EntryPoint } from '@/types/signals';

@Component({
    components: {},
    mixins: [ModelMixin],
})
export default class SignalEntryPoint extends Mixins<ModelMixin<EntryPoint>>(ModelMixin) {
    private requiredRules = [(s: string) => !!s || 'Field is required'];

    @Prop({ type: Number, required: true })
    order!: number;

    @Prop({ type: Function, required: true })
    onDelete!: () => void;
}
</script>
