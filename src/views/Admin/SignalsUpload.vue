<template>
    <v-container class="SignalsUpload">
        <v-row>
            <v-col cols="12" sm="4"><div class="text-h2">CSV upload</div></v-col>
            <v-col cols="12" sm="4"></v-col>
            <v-col cols="12" sm="4" class="text-right">
                <v-file-input
                    accept=".csv"
                    label="CSV file with signals"
                    @change="handleUpload"
                    :multiple="false"
                    show-size
                ></v-file-input>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="border-c checkboxes" rowspan="2"></th>
                                <!-- <th class="border-c order-head" rowspan="2">
                                    #
                                </th> -->
                                <th class="border-c date-head" rowspan="2">
                                    {{ $t('Date') }}
                                </th>
                                <th class="border-c currency" rowspan="2">
                                    {{ $t('Currency') }}
                                </th>
                                <th class="border-c type-head" rowspan="2">
                                    {{ $t('Type') }}
                                </th>
                                <th class="border-c risk-head" rowspan="2">
                                    {{ $t('Risk') }}
                                </th>
                                <th class="border-c term-head" rowspan="2">
                                    {{ $t('Term') }}
                                </th>
                                <th class="border-c Volume" rowspan="2">
                                    {{ $t('Volume') }}
                                </th>
                                <th class="border-c entry-points-head" colspan="2">
                                    {{ $t('Entry points') }}
                                </th>
                                <th class="border-c take-profit-head" colspan="3">
                                    {{ $t('Take profit') }}
                                </th>
                                <th class="border-c stop-loss-head" colspan="3">
                                    {{ $t('Stop loss') }}
                                </th>
                                <th class="border-o post-head" rowspan="2">
                                    {{ $t('Post') }}
                                </th>
                            </tr>
                            <tr>
                                <th class="border-l entrry-point-price-head">
                                    {{ $t('Price') }}
                                </th>
                                <th class="border-l entrry-point-comment-head">
                                    {{ $t('Comment') }}
                                </th>

                                <th class="border-l take-profit-price-head">
                                    {{ $t('Price') }}
                                </th>
                                <th class="border-l take-profit-volume-head">
                                    {{ $t('Volume') }}
                                </th>
                                <th class="border-l take-profit-comment-head">
                                    {{ $t('Comment') }}
                                </th>

                                <th class="border-l stop-loss-price-head">
                                    {{ $t('Price') }}
                                </th>
                                <th class="border-l stop-loss-volume-head">
                                    {{ $t('Volume') }}
                                </th>
                                <th class="border-l stop-loss-comment-head">
                                    {{ $t('Comment') }}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <template v-for="(row, index) in rows">
                                <tr :class="`table-row ${row.ok ? '' : 'error'}`" :key="index">
                                    <td class="text-center">
                                        <v-checkbox
                                            dense
                                            hide-details
                                            v-model="selected"
                                            :disabled="!row.ok || rows.saved"
                                            :value="index"
                                        ></v-checkbox>
                                    </td>
                                    <!-- <td class="text-center">{{ row.order }}</td> -->
                                    <td class="text-center">{{ row.date | dayjs('format', 'HH:mm DD.MM.YYYY') }}</td>
                                    <td class="text-center">
                                        {{ row.title }} <br />
                                        ({{ row.ticker }})
                                    </td>
                                    <td>{{ row.type }}</td>
                                    <td>{{ row.risk }}</td>
                                    <td>{{ row.term }}</td>
                                    <td>{{ row.volume }}</td>

                                    <td>
                                        <template v-for="(ep, key) in row.entryPoints">
                                            <div :key="key">{{ ep.price }}</div>
                                        </template>
                                    </td>

                                    <td>
                                        <template v-for="(ep, key) in row.entryPoints">
                                            <div :key="key">{{ ep.comment }}</div>
                                        </template>
                                    </td>

                                    <td>
                                        <template v-for="(tp, key) in row.takeProfitOrders">
                                            <div :key="key">{{ tp.price }}</div>
                                        </template>
                                    </td>

                                    <td>
                                        <template v-for="(tp, key) in row.takeProfitOrders">
                                            <div :key="key">{{ tp.volume * 100 }}%</div>
                                        </template>
                                    </td>

                                    <td>
                                        <template v-for="(tp, key) in row.takeProfitOrders">
                                            <div :key="key">{{ tp.comment }}</div>
                                        </template>
                                    </td>

                                    <td>
                                        <template v-for="(sl, key) in row.stopLossOrders">
                                            <div :key="key">{{ sl.price }}</div>
                                        </template>
                                    </td>

                                    <td>
                                        <template v-for="(sl, key) in row.stopLossOrders">
                                            <div :key="key">{{ sl.volume * 100 }}%</div>
                                        </template>
                                    </td>

                                    <td>
                                        <template v-for="(sl, key) in row.stopLossOrders">
                                            <div :key="key">{{ sl.comment }}</div>
                                        </template>
                                    </td>

                                    <td class="post-cell">{{ row.post }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" class="button-box text-right">
                <v-btn color="success" class="ml-4" @click="handleSave" :disabled="!selected.length">Save</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<style lang="scss">
.SignalsUpload {
    .border-c,
    .border-l,
    .border-o {
        border-left: 1px solid #dddddd;
        border-bottom: 1px solid #dddddd;
        text-align: center !important;
    }

    .border-c {
        border-top: 1px solid #dddddd;
    }
    .border-l {
        border-top: none;
    }
    .border-o {
        border: 1px solid #dddddd;
    }

    th {
        padding: 4px !important;
    }

    td {
        font-size: 10px !important;
        padding: 4px !important;
    }

    .post-cell {
        max-width: 200px;
    }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Papa from 'papaparse';
import Popup from '@/components/Popup.vue';
import { Dictionary } from '@/types/base';
import * as api from '@/modules/api';

@Component({
    components: {
        Popup,
    },
})
export default class SignalsUpload extends Vue {
    private selected = [];
    private rows: Dictionary = {};

    private parseEntryPoints(entryPointsStr: string) {
        const pairs = entryPointsStr.split(/\|/);

        return pairs.map(pair => {
            const [price, comment] = pair.split(/\//);

            const data = {
                price: parseFloat(price),
                comment,
                signalId: 0,
                ok: true,
            };

            data.ok = !isNaN(data.price);
            return data;
        });
    }

    private parseOrders(ordersStr: string) {
        const pairs = ordersStr.split(/\|/);

        const percentToDecimal = pct => {
            if (pct.indexOf('%') === -1) return null;

            return parseFloat(pct.replace(/[^0-9]/g, '')) / 100;
        };

        return pairs.map(pair => {
            const [price, volume, comment] = pair.split(/\//);

            const data = {
                price: parseFloat(price),
                volume: percentToDecimal(volume),
                comment,
                signalId: 0,
                ok: true,
            };

            data.ok = !isNaN(data.price) && !isNaN(data.price);

            return data;
        });
    }

    private async parseCsv(rows: string[]) {
        this.rows = rows.map((row, index) => {
            const [date, title, type, risk, term, volume, entryPoints, takeProfitOrders, stopLossOrders, post] = row;

            const data = {
                order: index,
                date: new Date(date),
                title,
                ticker: title.toUpperCase().replace(/[^A-Z]/g, ''),
                type: type.toLowerCase(),
                risk: risk.toLowerCase(),
                term: term.toLowerCase(),
                volume: parseFloat(volume.replace(/[^0-9]/g, '')) / 100,
                entryPoints: this.parseEntryPoints(entryPoints),
                takeProfitOrders: this.parseOrders(takeProfitOrders),
                stopLossOrders: this.parseOrders(stopLossOrders),
                post,
                ok: true,

                // Harcoded fields
                status: 'delayed',
                commentable: true,
                paid: true,
            };

            data.ok =
                !isNaN(data.date.getTime()) &&
                !!data.ticker &&
                !isNaN(data.volume) &&
                !data.entryPoints.find(ep => !ep.ok) &&
                !data.takeProfitOrders.find(order => !order.ok) &&
                !data.stopLossOrders.find(order => !order.ok);

            return data;
        });

        console.log(JSON.stringify(this.rows));
    }

    handleUpload(files: File[]) {
        this.rows = [];
        const [file] = files;
        const reader = new FileReader();

        reader.onload = e => {
            if (!e.target || !e.target.result) {
                return;
            }

            const csv = Papa.parse(e.target.result as string, { skipEmptyLines: true });

            const { data } = csv;

            if (!data) {
                return;
            }

            const [, ...rows] = data;

            if (!rows || !rows.length) {
                return;
            }

            this.parseCsv(rows as string[]);
        };

        reader.readAsText(file || '');
    }

    async handleSave() {
        const signals = this.selected.map(index => {
            const row = this.rows[index];

            delete row.order;
            delete row.ok;

            row.entryPoints.forEach((ep: Dictionary) => {
                delete ep.order;
                delete ep.ok;
            });
            row.takeProfitOrders.forEach((order: Dictionary) => {
                delete order.order;
                delete order.ok;
            });
            row.stopLossOrders.forEach((order: Dictionary) => {
                delete order.order;
                delete order.ok;
            });

            return row;
        });

        const { signalsIds } = await api.uploadSignals(signals);

        if (!Array.isArray(signalsIds)) {
            this.$toasted.error(this.$t('Unable to uploade some signals') as string);
            return;
        }

        this.$toasted.success(this.$t('Signals successfully uploaded') as string);

        this.selected.forEach(index => {
            this.rows[index].saved = true;
        });
    }
}
</script>
