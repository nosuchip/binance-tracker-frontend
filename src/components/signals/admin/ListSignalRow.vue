<template>
    <tr :class="`ListSignalRow ${odd ? 'odd' : ''}`" @click="handleClick">
        <td class="id-cell">{{ model.id }}</td>
        <td class="ticker-cell">{{ model.title || model.ticker }}</td>
        <td class="ticker-cell">{{ model.type }}</td>
        <td class="channel-cell">{{ model.channel || '-' }}</td>
        <td>
            <div class="d-flex flex-column">
                <div class="published-at-data">
                    {{ model.createdAt | dayjs('format', 'HH:mm DD.MM.YY') }}
                </div>
                <!--
                <div class="updated-at-data font-small">
                    {{ $t('updated at') }} {{ model.updatedAt | dayjs('format', 'HH:mm DD.MM.YY') }}
                </div>
                -->
            </div>
        </td>
        <td class="price-cell">{{ model.price || '-' }}</td>
        <td class="current-price-cell">
            <div class="d-flex flex-column">
                <div class="current-price">
                    {{ model.lastPrice || '-' }}
                </div>
                <div class="remainings">{{ $t('remains in position') }}: {{ remainings }}</div>
            </div>
        </td>
        <td class="profitability-cell">{{ profitability }}</td>

        <td>
            <template v-for="(order, index) in model.takeProfitOrders">
                <list-order-row :order="order" :key="index" />
            </template>
        </td>

        <td>
            <template v-for="(order, index) in model.stopLossOrders">
                <list-order-row :order="order" :key="index" />
            </template>
        </td>

        <td>
            {{ status }}
            <v-btn icon x-small @click.stop="showSignalStatusHelp = true">
                <v-icon dark>mdi-information-outline</v-icon>
            </v-btn>
            <popup v-model="showSignalStatusHelp" :title="$t('Signal statuses')" :text="$t('statusesHelp')" />
        </td>
    </tr>
</template>

<style lang="scss" scoped>
.ListSignalRow {
    cursor: pointer;

    ::v-deep td {
        text-align: right;
        padding: 4px !important;
        font-size: 12px !important;

        &.ticker-cell {
            width: 50px !important;
        }

        &.profitability-cell {
            width: 50px !important;
        }

        &.price-cell {
            width: 100px;
        }

        &.current-price-cell {
            width: 130px;
        }
    }

    .updated-at-data,
    .remainings {
        font-size: 11px;
        color: #aaa;
    }

    &.odd {
        background-color: #f9f9f9;
    }

    .details {
        .details-button {
            width: 150px;

            ::v-deep .v-btn__content {
                font-size: 11px;
            }
        }
    }
}
</style>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';
import { Signal } from '@/types/signals';
import Popup from '@/components/Popup.vue';
import ListOrderRow from '@/components/signals/admin/ListOrderRow.vue';

@Component({
    components: {
        Popup,
        ListOrderRow,
    },
    mixins: [ModelMixin],
})
export default class ListSignalRow extends Mixins<ModelMixin<Signal>>(ModelMixin) {
    private showSignalStatusHelp = false;

    @Prop({ default: false })
    odd!: boolean;

    get status() {
        const mapping = {
            delayed: this.$t('Delayed'),
            active: this.$t('Active'),
            finished: this.$t('Finished'),
            cancelled: this.$t('Cancelled'),
        };

        return mapping[this.model.status];
    }

    get profitability() {
        if (!this.model.profitability || !this.model.price) {
            return '-';
        }

        return ((this.model.profitability / this.model.price - 1) * 100).toFixed(3) + '%';
    }

    get remainings() {
        return !this.model.remaining || isNaN(this.model.remaining as number)
            ? '0'
            : `${(this.model.remaining * 100).toFixed(2)}%`;
    }

    handleClick() {
        this.$router.push({ name: 'signal-edit', params: { signalId: `${this.model.id}` } });
    }
}
</script>
