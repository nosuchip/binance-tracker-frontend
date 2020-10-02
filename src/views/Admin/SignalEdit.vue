<template>
    <v-container v-if="signal" class="SignalEdit">
        <div class="text-center text-h5">Signal information</div>
        <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model="signal.ticker"
                    :rules="requiredRules"
                    label="Ticker"
                    required
                    hide-details
                ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
                <v-select label="Signal status" v-model="signal.status" :items="statusOptions" hide-details></v-select>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model.number="signal.price"
                    type="number"
                    :rules="requiredRules"
                    label="Price"
                    required
                    hide-details
                ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field
                    v-model.number="signal.profitability"
                    type="number"
                    label="Profitability"
                    hide-details
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" sm="6">
                <v-select label="Risk" v-model="signal.risk" :items="riskOptions" hide-details></v-select>
            </v-col>
            <v-col cols="12" sm="6">
                <v-text-field v-model.number="signal.volume" label="Volume" required hide-details></v-text-field>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" sm="6">
                <v-select label="Terms" v-model="signal.term" :items="termsOptions" hide-details></v-select>
            </v-col>
            <v-col cols="12" sm="6"> </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" sm="6">
                <v-checkbox v-model="signal.paid" label="Paid signal" hide-details></v-checkbox>
            </v-col>
            <v-col cols="12" sm="6">
                <v-checkbox
                    v-model="signal.commentsAllowed"
                    label="Signal commenting allowed"
                    hide-details
                ></v-checkbox>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" class="text-right">
                <v-btn class="mr-4 button" @click="handleClose">Close</v-btn>
                <v-btn class="button" color="success" @click="handleSave">Save</v-btn>
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
                <v-btn class="button" color="error" @click="handleDelete">Delete signal</v-btn>
            </v-card-text>
        </v-card>
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
import { Signal } from '@/types/signals';

const defaultSignal: Signal = {
    id: 0,
    status: 'active', //
    profitability: 0, //
    ticker: '', //
    risk: '',
    term: '',
    volume: 0,
    paid: false, //
    commentsAllowed: true, //
    price: 0, //
} as Signal;

@Component({
    components: {},
    mixins: [LoadableMixin],
})
export default class SignalEdit extends Mixins<LoadableMixin>(LoadableMixin) {
    private readonly statusOptions = [
        { value: 'delayed', text: 'Delayed' },
        { value: 'active', text: 'Active' },
        { value: 'fired', text: 'Fired' },
        { value: 'cancelled', text: 'Cancelled' },
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
    private requiredRules = [(s: string) => !!s || 'Field is required'];
    private signal: Signal = { ...defaultSignal };

    private async fetch() {
        const { signalId } = this.$route.params;

        if (signalId === 'new') {
            return;
        }

        try {
            this.setLoading(true);

            const { signal } = await api.loadSignal(signalId);
            this.signal = {
                ...defaultSignal,
                ...signal,
            };
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
            commentsAllowed: !!this.signal.commentsAllowed,
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
