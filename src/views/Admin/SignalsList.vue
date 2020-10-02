<template>
    <v-container class="SignalsList" fluid>
        <v-custom-table
            title="Signals"
            :headers="headers"
            :items="items"
            :perPage="pagination.perPage"
            :total="pagination.total"
            :loading="loading"
            :onOptionsChange="handleTableChange"
            :onSearchChange="handleTableSearch"
            :onRowClick="handleRowClick"
            :onRefresh="fetch"
            newItemUrl="/signals/new"
        >
            <template slot="search">
                <v-text-field
                    class="mr-2 search-field"
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search by ticker"
                    single-line
                    hide-details
                    dense
                    @keyup="event => handleTableSearch(event.target.value)"
                ></v-text-field>
            </template>
        </v-custom-table>
    </v-container>
</template>

<style lang="scss" scoped>
.SignalsList {
    .search-field {
        max-width: 200px;
    }

    .search-type {
        max-width: 100px;
    }
}
</style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { State } from 'vuex-class';
import LoadableMixin from '@/mixins/Loadable';
import PaginatedMixin from '@/mixins/Paginated';
import VCustomTable from '@/components/Table.vue';
import * as api from '@/modules/api';
import { Signal } from '@/types/signals';
import { DataOptions } from 'vuetify';
import { Debounce } from '@/modules/decorators';

@Component({
    components: {
        VCustomTable,
    },
    mixins: [LoadableMixin, PaginatedMixin],
})
export default class SignalsList extends Mixins<LoadableMixin, PaginatedMixin<DeviceInfo>>(
    LoadableMixin,
    PaginatedMixin,
) {
    @State('loading')
    readonly loading!: boolean;

    private search = '';
    private debounceSearch: number | null = null;

    private headers = [
        { text: 'Id', value: 'id' },
        { text: 'Ticker', value: 'ticker' },
        { text: 'Price', value: 'price' },
        { text: 'Status', value: 'status' },
        { text: 'Profitability', value: 'profitability' },
        { text: 'Risk', value: 'risk' },
        { text: 'Term', value: 'term' },
        { text: 'Volume', value: 'volume' },
        { text: 'Is paid', value: 'paid' },
        { text: 'Is commentable', value: 'commentsAllowed' },
    ];

    private async fetch() {
        try {
            this.setLoading(true);

            const paginated = await api.loadSignals({
                page: this.pagination.page,
                perPage: this.pagination.perPage,
                filter: this.pagination.filter,
            });
            this.updatePagination(paginated);
        } catch (error) {
            /// Do nothing
            return;
        } finally {
            this.setLoading(false);
        }
    }

    handleTableChange(options: DataOptions) {
        const { page, itemsPerPage } = options;
        this.pagination = {
            ...this.pagination,
            page,
            perPage: itemsPerPage,
        };

        this.fetch();
    }

    @Debounce(500)
    handleTableSearch(filter: string) {
        this.pagination = {
            ...this.pagination,
            filter,
        };

        this.fetch();
    }

    handleRowClick(row: Signal) {
        const { id } = row;

        if (id) {
            this.$router.push({ name: 'signal-edit', params: { signalId: id } });
        }
    }
}
</script>
