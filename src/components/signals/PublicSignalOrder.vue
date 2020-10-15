<template>
    <div class="PublicSignalOrder">
        <v-tooltip left :disabled="!comment">
            <template v-slot:activator="{ on, attrs }">
                <div :class="closed ? 'closed' : ''" v-bind="attrs" v-on="on">{{ order.type }} @ {{ order.price }}</div>
            </template>
            <span>{{ comment }}</span>
        </v-tooltip>
    </div>
</template>

<style lang="scss" scoped>
.PublicSignalOrder {
    font-size: 10px;

    .closed {
        text-decoration: line-through;
        color: green;
    }
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Order } from '@/types/signals';

@Component({
    components: {},
})
export default class PublicSignalOrder extends Vue {
    @Prop({ default: false })
    closed!: boolean;

    @Prop({ required: false })
    comment?: string;

    @Prop({ required: true })
    order!: Order;
}
</script>
