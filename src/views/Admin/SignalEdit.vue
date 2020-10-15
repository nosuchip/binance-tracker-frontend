<template>
    <v-container v-if="signal" class="SignalEdit">
        <div class="text-center text-h5">{{ $t('Signal information') }}</div>

        <v-row>
            <v-col cols="12" sm="4">
                <signal-data ref="signalData" v-model="signal" :disabled="locked" />
            </v-col>

            <v-col cols="12" sm="8">
                <signal-edit-panel
                    :title="$t('Entry points')"
                    :onAdd="handleEntryPointAdd"
                    class="mb-4 pb-4"
                    :error="entryPointError"
                >
                    <v-form ref="entryPointsRef" v-model="entryPointsValid">
                        <template v-for="(entryPoint, index) in signal.entryPoints">
                            <signal-entry-point
                                :order="index + 1"
                                :key="index"
                                :value="entryPoint"
                                :disabled="locked"
                                :onDelete="() => handleEntryPointDelete(index)"
                            ></signal-entry-point>
                        </template>
                    </v-form>
                </signal-edit-panel>

                <signal-edit-panel
                    :title="$t('Take profits')"
                    :onAdd="handleTakeProfitAdd"
                    class="mb-4 pb-4"
                    :error="takeProfitError"
                >
                    <v-form ref="takeProfitOrdersRef" v-model="takeProfitOrdersValid">
                        <template v-for="(order, index) in signal.takeProfitOrders">
                            <signal-order
                                :order="index + 1"
                                :key="index"
                                :value="order"
                                :disabled="locked"
                                :onDelete="() => handleTakeProfitDelete(index)"
                            ></signal-order>
                        </template>
                    </v-form>
                </signal-edit-panel>

                <signal-edit-panel
                    :title="$t('Stop losses')"
                    :onAdd="handleStopLossAdd"
                    class="mb-4 pb-4"
                    :error="stopLossError"
                >
                    <v-form ref="stopLossOrdersRef" v-model="stopLossOrdersValid">
                        <template v-for="(order, index) in signal.stopLossOrders">
                            <signal-order
                                :order="index + 1"
                                :key="index"
                                :value="order"
                                :disabled="locked"
                                :onDelete="() => handleStopLossDelete(index)"
                            ></signal-order>
                        </template>
                    </v-form>
                </signal-edit-panel>
            </v-col>
        </v-row>

        <v-row class="button-box">
            <v-col xs="12" class="text-right">
                <v-btn color="default" @click="handleClose">Close</v-btn>
                <v-btn color="success" class="ml-4" @click="handleSave" :disabled="locked">Save</v-btn>
            </v-col>
        </v-row>

        <v-card class="danger-section" v-if="signal.id">
            <v-card-title class="danger-section-title">
                Danger section
            </v-card-title>
            <v-card-text class="d-flex justify-space-between align-center">
                <div>
                    This action irreversibly delete signal from database. All correspondig data (history, comments,
                    posts) would be removed too.
                </div>
                <v-btn class="button" color="error" @click="handleDelete" :disabled="locked">Delete signal</v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style lang="scss" scoped>
.SignalEdit {
    .button-box {
        button {
            width: 150px;
        }
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
import { Validateable } from '@/types/base';

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
    private takeProfitError = '';
    private stopLossError = '';
    private entryPointError = '';
    private takeProfitOrdersValid = true;
    private stopLossOrdersValid = true;
    private entryPointsValid = true;
    private signal: Signal = { ...defaultSignal() };

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

    private async fetch() {
        const { signalId } = this.$route.params;

        if (signalId === 'new') {
            return;
        }

        try {
            this.setLoading(true);

            const { signal } = await api.loadSignal(signalId);
            this.signal = defaultSignal(signal);
        } catch (error) {
            this.$toasted.error('Unable to load signal');
        } finally {
            this.setLoading(false);
        }
    }

    mounted() {
        this.fetch();
    }

    private validate() {
        this.takeProfitError = '';
        this.stopLossError = '';
        this.entryPointError = '';
        this.takeProfitOrdersValid = true;
        this.stopLossOrdersValid = true;
        this.entryPointsValid = true;

        (this.$refs.signalData as Validateable).validate();
        (this.$refs.entryPointsRef as Validateable).validate();
        (this.$refs.takeProfitOrdersRef as Validateable).validate();
        (this.$refs.stopLossOrdersRef as Validateable).validate();

        const hasEntryPoints = this.signal.entryPoints.length > 0;
        if (!hasEntryPoints) {
            this.entryPointError = this.$t('edit.entry_point_must_exists') as string;
        }

        const hasTP = this.signal.takeProfitOrders.length > 0;
        if (!hasTP) {
            this.takeProfitError = this.$t('edit.take_profit_must_exists') as string;
        }

        const hasSL = this.signal.stopLossOrders.length > 0;
        if (!hasSL) {
            this.stopLossError = this.$t('edit.stop_loss_must_exists') as string;
        }

        if (this.entryPointError || this.takeProfitError || this.stopLossError) {
            return false;
        }

        const sumTP = this.signal.takeProfitOrders.reduce((total, tp) => (total += tp.volume), 0);
        if (sumTP !== 1) {
            this.takeProfitError = this.$t('edit.take_profit_must_be_1') as string;
        }

        const sumSL = this.signal.stopLossOrders.reduce((total, sl) => (total += sl.volume), 0);
        if (sumSL !== 1) {
            this.stopLossError = this.$t('edit.stop_loss_must_be_1') as string;
        }

        if (this.takeProfitError || this.stopLossError) {
            return false;
        }

        const highestEntryPoint = Math.max(...this.signal.entryPoints.map(ep => ep.price));
        const lowestEntryPoint = Math.min(...this.signal.entryPoints.map(ep => ep.price));

        if (this.signal.type === 'long') {
            const hasTpBelowMaxEntry = this.signal.takeProfitOrders.find(tp => tp.price <= highestEntryPoint);
            if (hasTpBelowMaxEntry) {
                this.takeProfitError = this.$t('edit.long_take_profit_must_be_greater_then_entry_points') as string;
                return false;
            }

            const hasSlAboveMinEntry = this.signal.stopLossOrders.find(sl => sl.price >= lowestEntryPoint);
            if (hasSlAboveMinEntry) {
                this.stopLossError = this.$t('edit.long_stop_loss_must_be_less_then_entry_points') as string;
                return false;
            }
        } else if (this.signal.type === 'short') {
            const hasTpAboveMinEntry = this.signal.takeProfitOrders.find(tp => tp.price >= lowestEntryPoint);
            if (hasTpAboveMinEntry) {
                this.takeProfitError = this.$t('edit.short_take_profit_must_be_less_then_entry_points') as string;
                return false;
            }

            const hasSlBelowMaxEntry = this.signal.stopLossOrders.find(sl => sl.price <= highestEntryPoint);
            if (hasSlBelowMaxEntry) {
                this.stopLossError = this.$t('edit.short_stop_loss_must_be_greater_then_entry_points') as string;
                return false;
            }
        }

        return true;
    }

    private async handleSave() {
        if (!this.validate()) {
            return;
        }

        const payload = {
            id: this.signal.id,
            status: this.signal.status || 'active',
            profitability: parseFloat(this.signal.profitability.toString()) || 0,
            ticker: this.signal.ticker,
            title: this.signal.title || this.signal.ticker,
            channel: this.signal.channel || '',
            price: parseFloat(this.signal.price.toString()) || 0,
            type: this.signal.type,
            risk: this.signal.risk,
            term: this.signal.term,
            volume: parseFloat(this.signal.volume.toString()),
            paid: !!this.signal.paid,
            commentable: !!this.signal.commentable,
            date: this.signal.date || new Date(),
            post: this.signal.post || '',
            comments: [],
            entryPoints: this.signal.entryPoints || [],
            takeProfitOrders: this.signal.takeProfitOrders || [],
            stopLossOrders: this.signal.stopLossOrders || [],
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
        const message = this.$t('edit.delete_signal_confirm') as string;

        if (this.signal.id && confirm(message)) {
            this.setLoading(true);

            try {
                await api.deleteSignal(this.signal.id);
            } finally {
                this.setLoading(false);
            }

            this.handleClose();
        }
    }

    get locked() {
        return this.signal.remaining !== 1;
    }
}
</script>
