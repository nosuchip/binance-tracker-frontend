<template>
    <v-container v-if="signal" class="SignalEdit">
        <div class="text-center text-h5">Signal information</div>

        <v-row>
            <v-col cols="12" sm="4">
                <signal-data v-model="signal" />
            </v-col>

            <v-col cols="12" sm="8">
                <signal-edit-panel title="Entry points" :onAdd="handleEntryPointAdd" class="mb-4 pb-4">
                    <template v-for="(entryPoint, index) in signal.entryPoints">
                        <signal-entry-point
                            :order="index + 1"
                            :key="index"
                            :value="entryPoint"
                            :onDelete="() => handleEntryPointDelete(index)"
                        ></signal-entry-point>
                    </template>
                </signal-edit-panel>

                <signal-edit-panel title="Take profits" :onAdd="handleTakeProfitAdd" class="mb-4 pb-4">
                    <template v-for="(order, index) in signal.takeProfitOrders">
                        <signal-order
                            :order="index + 1"
                            :key="index"
                            :value="order"
                            :onDelete="() => handleTakeProfitDelete(index)"
                        ></signal-order>
                    </template>
                </signal-edit-panel>

                <signal-edit-panel title="Stop losses" :onAdd="handleStopLossAdd" class="mb-4 pb-4">
                    <template v-for="(order, index) in signal.stopLossOrders">
                        <signal-order
                            :order="index + 1"
                            :key="index"
                            :value="order"
                            :onDelete="() => handleStopLossDelete(index)"
                        ></signal-order>
                    </template>
                </signal-edit-panel>
            </v-col>
        </v-row>
    </v-container>
</template>

<style lang="scss" scoped>
.SignalEdit {
    .button {
        width: 150px;
    }

    .danger-section {
        margin-top: 30px;

        .danger-section-title {
            color: #ff5252;
        }
    }
}
</style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import LoadableMixin from '@/mixins/Loadable';
import * as api from '@/modules/api';
import { defaultSignal, defaultEntryPoint, defaultTakeProfit, defaultStopLoss, Signal } from '@/types/signals';
import SignalData from '@/components/signals/admin/SignalData.vue';
import SignalEditPanel from '@/components/signals/admin/SignalEditPanel.vue';
import SignalEntryPoint from '@/components/signals/admin/SignalEntryPoint.vue';
import SignalOrder from '@/components/signals/admin/SignalOrder.vue';

@Component({
    components: {
        SignalData,
        SignalEditPanel,
        SignalEntryPoint,
        SignalOrder,
    },
    mixins: [LoadableMixin],
})
export default class SignalEdit extends Mixins<LoadableMixin>(LoadableMixin) {
    private handleEntryPointAdd() {
        this.signal.entryPoints = [...this.signal.entryPoints, defaultEntryPoint({ signalId: this.signal.id })];
    }

    private handleEntryPointDelete(index: number) {
        this.signal.entryPoints = this.signal.entryPoints.filter((_entryPoint, i) => i !== index);
    }

    private handleTakeProfitAdd() {
        this.signal.takeProfitOrders = [
            ...this.signal.takeProfitOrders,
            defaultTakeProfit({ signalId: this.signal.id }),
        ];
    }

    private handleTakeProfitDelete(index: number) {
        this.signal.takeProfitOrders = this.signal.takeProfitOrders.filter((_entryPoint, i) => i !== index);
    }

    private handleStopLossAdd() {
        this.signal.stopLossOrders = [...this.signal.stopLossOrders, defaultStopLoss({ signalId: this.signal.id })];
    }

    private handleStopLossDelete(index: number) {
        this.signal.stopLossOrders = this.signal.stopLossOrders.filter((_entryPoint, i) => i !== index);
    }

    private signal: Signal = { ...defaultSignal() };

    private async fetch() {
        const { signalId } = this.$route.params;

        if (signalId === 'new') {
            return;
        }

        try {
            this.setLoading(true);

            const { signal } = await api.loadSignal(signalId);
            this.signal = defaultSignal({ signal });
        } catch (error) {
            this.$toasted.error('Unable to load signal');
        } finally {
            this.setLoading(false);
        }
    }

    mounted() {
        this.fetch();
    }

    async handleRemove(signal: Signal) {
        if (signal.id) {
            this.setLoading(true);

            try {
                await api.deleteSignal(signal.id);
            } finally {
                this.setLoading(false);
            }

            this.$router.push({ name: 'signals-list' });
        }
    }

    private async handleSave() {
        const payload = {
            id: this.signal.id,
            status: this.signal.status,
            profitability: this.signal.profitability,
            ticker: this.signal.ticker,
            risk: this.signal.risk,
            term: this.signal.term,
            volume: this.signal.volume,
            paid: !!this.signal.paid,
            commentable: !!this.signal.commentable,
            price: this.signal.price,
        };

        this.setLoading(true);

        try {
            if (payload.id) {
                this.signal = await api.updateSignal(payload);
            } else {
                this.signal = await api.createSignal(payload);
            }

            this.$toasted.success('Signal saved');
        } catch (error) {
            this.$toasted.error('Unable to save signal!');
            return;
        } finally {
            this.setLoading(false);
        }

        this.handleClose();
    }

    private handleClose() {
        this.$router.back();
    }

    private async handleDelete() {
        if (!this.signal.id) {
            return;
        }
        try {
            await api.deleteSignal(this.signal.id);
            this.$toasted.success('Signal removed');
        } catch (error) {
            this.$toasted.error('Unable to delete signal!');
            return;
        } finally {
            this.setLoading(false);
        }

        this.handleClose();
    }
}
</script>
