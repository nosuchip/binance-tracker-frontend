<template>
    <v-row>
        <v-col>
            <v-card>
                <v-card-title>
                    <slot name="title">
                        {{ title }}
                    </slot>

                    <slot name="button-refresh">
                        <v-btn icon color="green" @click="handleRefresh">
                            <v-icon>mdi-cached</v-icon>
                        </v-btn>
                    </slot>

                    <slot name="button-add">
                        <v-btn icon color="info" v-if="newItemUrl" :to="newItemUrl">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </slot>

                    <slot name="toolbar"></slot>

                    <v-spacer></v-spacer>

                    <slot name="search">
                        <v-text-field
                            class="search"
                            v-if="!disableSearch"
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                            @keyup="searchChanged"
                            @click:append="searchChanged"
                        ></v-text-field>
                    </slot>
                </v-card-title>

                <v-data-table
                    :headers="getHeaders"
                    :items="items"
                    :items-per-page="perPage"
                    :class="getClass"
                    :options.sync="options"
                    :server-items-length="total"
                    @click:row="handleRowClick"
                >
                    <!-- Pass on all named slots -->
                    <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot" :props="props" />

                    <!-- Pass on all scoped slots -->
                    <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
                        <slot :name="slot" v-bind="scope" />
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<style lang="scss" scoped>
.row {
    align-self: start;

    ::v-deep tr {
        cursor: pointer;
    }
}
</style>

<script lang="ts">
import { Debounce } from '@/modules/decorators';
import { DEFAULT_PAGE_SIZE } from '@/types/pagination';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { DataOptions, DataTableHeader } from 'vuetify';

export type TableHeader = string | DataTableHeader;

@Component({
    components: {},
})
export default class Table<T> extends Vue {
    @Prop({ default: '' })
    protected readonly title!: string;

    @Prop({ default: [] })
    protected readonly items!: T[];

    @Prop({ default: [], required: true })
    protected readonly headers!: TableHeader[];

    @Prop({ default: '' })
    protected readonly className!: string;

    @Prop({ default: 0 })
    protected readonly total!: number;

    @Prop({ default: DEFAULT_PAGE_SIZE })
    protected readonly perPage!: number;

    @Prop({ default: 1 })
    protected readonly page!: number;

    @Prop({ default: false })
    protected readonly loading!: boolean;

    @Prop({ default: 'Loading data...' })
    protected readonly loadingText!: string;

    @Prop({ default: false })
    protected readonly disableSearch!: boolean;

    @Prop({ default: '' })
    protected readonly newItemUrl?: string;

    @Prop({ type: Array, required: false, default: () => [] })
    protected readonly itemSlots!: object[];

    @Prop({ type: Function, required: true })
    onOptionsChange!: (options: DataOptions) => void;

    @Prop({ type: Function, required: false })
    onSearchChange!: (search: string) => void;

    @Prop({ type: Function, required: false })
    onRowClick!: (row: T) => void;

    @Prop({ type: Function, required: false })
    onRefresh!: () => void;

    private options: DataOptions = {
        page: this.page,
        itemsPerPage: this.perPage,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
    };

    private search = '';

    get getClass() {
        return `elevation-1 ${this.className || ''}`;
    }

    get getHeaders() {
        const defaultHeader = {
            align: 'start',
            sortable: false,
            filterable: false,
            groupable: false,
        };

        return this.headers.map(header => {
            if (typeof header === 'string') {
                return {
                    ...defaultHeader,
                    text: header,
                    value: header,
                };
            }

            return {
                ...defaultHeader,
                ...header,
            };
        });
    }

    handleRowClick(row: T) {
        if (this.onRowClick) {
            this.onRowClick(row);
        }
    }

    handleRefresh() {
        if (this.onRefresh) {
            this.onRefresh();
        }
    }

    @Watch('options')
    private optionsChanged() {
        this.onOptionsChange(this.options);
    }

    @Watch('search')
    @Debounce(500)
    private searchChanged() {
        if (this.onSearchChange) {
            this.onSearchChange(this.search);
        }
    }
}
</script>
