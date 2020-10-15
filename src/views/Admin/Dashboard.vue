<template>
    <v-container class="Dashboard" fluid>
        <!-- <div class="text-h2">{{ $t('Signals') }}</div> -->

        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="currency-head">
                            {{ $t('Currency') }}
                        </th>
                        <th class="type-head">
                            {{ $t('Type') }}
                        </th>
                        <th class="channel-head">
                            {{ $t('Channel') }}
                        </th>
                        <th class="published-at-head">
                            {{ $t('Published') }}
                        </th>
                        <th class="entry-price-head">
                            {{ $t('Entry price') }}
                        </th>
                        <th class="last-triggered-price-head">
                            {{ $t('Triggered price') }}
                        </th>
                        <th class="profitability-head">
                            {{ $t('Profitability') }}
                        </th>
                        <th class="takeprofit-head">
                            {{ $t('Take profit') }}
                        </th>
                        <th class="stoploss-head">
                            {{ $t('Stop loss') }}
                        </th>
                        <th class="status-head">
                            {{ $t('Status') }}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <template v-for="(signal, index) in signals">
                        <list-signal-row :key="index" :value="signal" :odd="!(index % 2)"></list-signal-row>
                    </template>
                </tbody>
            </template>
        </v-simple-table>

        <custom-pagination v-model="pagination" :onPage="handlePage" />
    </v-container>
</template>

<style lang="scss" scoped>
.Dashboard {
    ::v-deep table {
        padding: 4px;

        th {
            text-align: center !important;
            padding: 4px !important;
        }
    }
}
</style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import LoadableMixin from '@/mixins/Loadable';
import PaginatedMixin from '@/mixins/Paginated';
import ListSignalRow from '@/components/signals/admin/ListSignalRow.vue';
import CustomPagination from '@/components/Pagination.vue';
import { Signal } from '@/types/signals';
import { actions } from '@/store/types';
import { Action, State } from 'vuex-class';
import { LoadSignalActionType } from '@/types/store/actions';

@Component({
    components: {
        ListSignalRow,
        CustomPagination,
    },
    mixins: [LoadableMixin, PaginatedMixin],
})
export default class Dashboard extends Mixins<LoadableMixin, PaginatedMixin<Signal>>(LoadableMixin, PaginatedMixin) {
    @State('signals')
    signals!: Signal[];

    @Action(actions.LOAD_SIGNALS)
    loadSignals!: LoadSignalActionType;

    private async fetch() {
        try {
            this.setLoading(true);

            const paginated = await this.loadSignals({
                page: this.pagination.page,
                perPage: this.pagination.perPage,
                filter: this.pagination.filter,
            });

            this.pagination.page = paginated.pagination.page;
            this.pagination.prev = paginated.pagination.prev;
            this.pagination.next = paginated.pagination.next;
            this.pagination.perPage = paginated.pagination.perPage;
            this.pagination.total = paginated.pagination.total;
            this.pagination.hasPrev = paginated.pagination.hasPrev;
            this.pagination.hasNext = paginated.pagination.hasNext;
            this.pagination.lastPage = Math.floor(paginated.pagination.total / this.pagination.perPage);

            this.items = [...this.items, ...paginated.data];
        } catch (error) {
            /// Do nothing
        } finally {
            this.setLoading(false);
        }
    }

    handlePage(page: number) {
        this.pagination = {
            ...this.pagination,
            page,
        };

        this.fetch();
    }

    mounted() {
        this.fetch();
    }
}
</script>