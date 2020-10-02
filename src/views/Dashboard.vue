<template>
    <v-container class="Dashboard">
        <div class="text-h1">Signals</div>

        <v-container class="signals">
            <template v-for="(signal, index) in items">
                <signal-row :key="index" :value="signal"></signal-row>
            </template>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import LoadableMixin from '@/mixins/Loadable';
import PaginatedMixin from '@/mixins/Paginated';
import SignalRow from '@/components/signals/SignalRow.vue';
import * as api from '@/modules/api';
import { Signal } from '@/types/signals';

@Component({
    components: {
        SignalRow,
    },
    mixins: [LoadableMixin, PaginatedMixin],
})
export default class Dashboard extends Mixins<LoadableMixin, PaginatedMixin<Signal>>(LoadableMixin, PaginatedMixin) {
    private async fetch() {
        try {
            this.setLoading(true);

            const paginated = await api.loadSignals({
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

    mounted() {
        this.fetch();
    }
}
</script>
