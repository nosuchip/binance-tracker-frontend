<template>
    <v-container class="Dashboard" fluid>
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
            <!-- <template slot="search">
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
            </template> -->

            <template #item="{ item, index }">
                <list-signal-row :value="item" :odd="!(index % 2)"></list-signal-row>
            </template>
        </v-custom-table>
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

    ::v-deep .search {
        max-width: 200px;
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
import ListSignalRow from '@/components/signals/admin/ListSignalRow.vue';

@Component({
    components: {
        VCustomTable,
        ListSignalRow,
    },
    mixins: [LoadableMixin, PaginatedMixin],
})
export default class Dashboard extends Mixins<LoadableMixin, PaginatedMixin<Signal>>(LoadableMixin, PaginatedMixin) {
    @State('loading')
    readonly loading!: boolean;

    private search = '';
    private debounceSearch: number | null = null;

    private headers = [
        { text: this.$t('Id'), value: 'id' },
        { text: this.$t('Currency'), value: 'title' },
        { text: this.$t('Type'), value: 'type' },
        { text: this.$t('Channel'), value: 'channel' },
        { text: this.$t('Published'), value: 'createdAt' },
        { text: this.$t('Entry price'), value: 'price' },
        { text: this.$t('Triggered price'), value: 'price' },
        { text: this.$t('Profitability'), value: 'profitability' },
        { text: this.$t('Take profit'), value: '' },
        { text: this.$t('Stop loss'), value: '' },
        { text: this.$t('Status'), value: 'status' },
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
            this.$router.push({ name: 'signal-edit', params: { signalId: `${id}` } });
        }
    }
}
</script>
