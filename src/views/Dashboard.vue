<template>
    <v-container class="Dashboard" fluid>
        <div class="text-h1">Signals</div>

        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="currency">
                            {{ $t('Currency') }}
                        </th>
                        <th class="published-at">
                            {{ $t('Published') }}
                        </th>
                        <th class="entry-price">
                            {{ $t('Entry price') }}
                        </th>
                        <th class="current-price">
                            {{ $t('Current price') }}
                        </th>
                        <th class="profitability">
                            {{ $t('Profitability') }}
                        </th>
                        <th class="status">
                            {{ $t('Status') }}
                        </th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    <template v-for="(signal, index) in signals">
                        <public-signal-row :key="index" :value="signal" :odd="!(index % 2)"></public-signal-row>
                    </template>
                </tbody>
            </template>
        </v-simple-table>
    </v-container>
</template>

<style lang="scss" scoped>
.Dashboard {
    th {
        text-align: right !important;
    }
}
</style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import LoadableMixin from '@/mixins/Loadable';
import PaginatedMixin from '@/mixins/Paginated';
import PublicSignalRow from '@/components/signals/PublicSignalRow.vue';
import { Signal } from '@/types/signals';
import ws from '@/modules/ws';
import { actions } from '@/store/types';
import { Action, State } from 'vuex-class';
import { LoadSignalActionType } from '@/types/store/actions';

@Component({
    components: {
        PublicSignalRow,
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

            // Very bad design =(
            const signalsIds = this.signals.map(signal => signal.id);

            ws.send({ event: 'subscribe_signals', payload: { signals: signalsIds } });
            ws.send({ event: 'subscribe_sparklines', payload: { signals: signalsIds } });
        } catch (error) {
            /// Do nothing
        } finally {
            this.setLoading(false);
        }
    }

    mounted() {
        this.fetch();
    }
}
</script>
