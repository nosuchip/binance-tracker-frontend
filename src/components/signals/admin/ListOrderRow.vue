<template>
    <div class="ListOrderRow">
        <v-tooltip left :disabled="!comment">
            <template v-slot:activator="{ on, attrs }">
                <div :class="{ closed: order.closed, 'closed-partially': closedPartially }" v-bind="attrs" v-on="on">
                    {{ orderType }} @ {{ order.price }} ({{ volume }})
                </div>
            </template>
            <span>{{ comment }}</span>
        </v-tooltip>
    </div>
</template>

<style lang="scss" scoped>
.ListOrderRow {
    font-size: 10px;

    .closed {
        color: green;
    }

    .closed-partially {
        color: orange;
    }
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Order } from '@/types/signals';

@Component({
    components: {},
})
export default class ListOrderRow extends Vue {
    @Prop({ required: true })
    order!: Order;

    get orderType(): string {
        return this.order.type === 'take profit' ? 'TP' : 'SL';
    }

    get volume(): string {
        if (this.order.closedVolume) {
            return `${(this.order.closedVolume * 100).toFixed(2)}%`;
        }

        return `${(this.order.volume * 100).toFixed(2)}%`;
    }

    get closedPartially(): boolean {
        return !!this.order.closedVolume && this.order.closedVolume !== this.order.volume;
    }

    get comment(): string {
        if (this.closedPartially) {
            return `Order closed partially at volume ${this.volume}`;
        }

        if (this.order.closed) {
            return `Order fully closed at volume ${this.volume}`;
        }

        return '';
    }
}
</script>
