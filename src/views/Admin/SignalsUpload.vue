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
                                <th class="border-c date-channel" rowspan="2">
                                    {{ $t('Channel') }}
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
                                <v-tooltip bottom :key="index" :disabled="!row.errors || !row.errors.length">
                                    <template v-slot:activator="{ on, attrs }">
                                        <tr
                                            :class="{
                                                'table-row': true,
                                                error: row.errors && row.errors.length,
                                                success: row.saved,
                                            }"
                                            :key="index"
                                            v-bind="attrs"
                                            v-on="on"
                                        >
                                            <td class="text-center">
                                                <v-checkbox
                                                    dense
                                                    hide-details
                                                    v-model="selected"
                                                    :disabled="(row.errors && row.errors.length > 0) || row.saved"
                                                    :value="index"
                                                ></v-checkbox>
                                            </td>
                                            <!-- <td class="text-center">{{ row.order }}</td> -->
                                            <td class="text-center">
                                                <div>{{ row.date | dayjs('format', 'HH:mm') }}</div>
                                                <div>{{ row.date | dayjs('format', 'DD.MM.YYYY') }}</div>
                                            </td>
                                            <td>{{ row.channel.name }}</td>
                                            <td class="text-center">
                                                {{ row.title }} <br />
                                                ({{ row.ticker }})
                                            </td>
                                            <td>{{ row.type }}</td>
                                            <td>{{ row.risk }}</td>
                                            <td>{{ row.term }}</td>
                                            <td>{{ row.volume ? row.volume * 100 + '%' : '' }}</td>

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

                                            <td class="post-cell">
                                                <v-btn icon v-if="row.post" @click.stop="showPostPreview(row.post)">
                                                    <v-icon>mdi-file-find</v-icon>
                                                </v-btn>
                                            </td>
                                        </tr>
                                    </template>
                                    <span v-html="row.errors ? row.errors.join('<br />') : ''"></span>
                                </v-tooltip>
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

        <v-dialog v-model="dialog" width="400px">
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text v-html="postPreview"> </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="
                            postPreview = false;
                            dialog = false;
                        "
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
import Big from 'big.js';

const percentToDecimal = (pct: string) => {
    try {
        if (pct.indexOf('%') === -1) throw new Error();

        return parseFloat(pct.replace(/[^0-9]/g, '')) / 100;
    } catch (error) {
        return null;
    }
};

const parseDate = (str: string) => {
    const [dd, hh] = str.split(/\s+/);
    const [day, month, year] = dd.split('.');
    const [hour, minutes] = hh.split(':');

    return new Date(`${year}-${month}-${day} ${hour}:${minutes}`);
};

const toFloat = (str: string) => {
    str = str.replace(',', '.');

    return parseFloat(str);
};

@Component({
    components: {
        Popup,
    },
})
export default class SignalsUpload extends Vue {
    private selected: number[] = [];
    private rows: Dictionary = {};
    private dialog = false;
    private postPreview = '';

    private showPostPreview(post: string) {
        if (!post) return;

        this.postPreview = post.replace(/\n/g, '<br />').replace(/\\n/g, '<br />');
        this.dialog = true;
    }

    private parseEntryPoints(entryPointsStr: string) {
        const pairs = entryPointsStr.split(/\|/);

        return pairs.map(pair => {
            const [price, comment] = pair.split(/\//);

            const data: Dictionary = {
                price: toFloat(price),
                comment,
                signalId: 0,
                errors: [],
            };

            if (isNaN(data.price)) {
                data.errors.push(`Entry point price ${price} is invalid`);
            }

            return data;
        });
    }

    private parseOrders(ordersStr: string) {
        const pairs = ordersStr.split(/\|/);

        return pairs.map(pair => {
            const [price, volume, comment] = pair.split(/\//);

            const data: Dictionary = {
                price: toFloat(price),
                volume: percentToDecimal(volume) || 1,
                comment,
                signalId: 0,
                errors: [],
            };

            if (isNaN(data.price)) {
                data.errors.push(`Price ${price} is invalid (must be float)`);
            }

            if (isNaN(data.volume)) {
                data.errors.push(`Volume ${volume} is invalid (must be percent)`);
            }

            return data;
        });
    }

    private validateRow(data: Dictionary) {
        const errors = [];

        if (!data.date.getTime || isNaN(data.date.getTime())) {
            errors.push(`Signal date invalid`);
        }

        if (!data.ticker) {
            errors.push(`Signal ticker missing`);
        }

        if (!data.channel.name) {
            errors.push(`Signal channel missing`);
        }

        if (data.type !== 'long' && data.type !== 'short') {
            errors.push(`Signal type invalid, must be one of "long" or "short"`);
        }

        if (!['high', 'medium', 'low'].includes(data.risk)) {
            errors.push(`Signal risk invalid, must be one of "high", "medium"  "low"`);
        }

        if (!['long', 'medium', 'short'].includes(data.term)) {
            errors.push(`Signal term invalid, must be one of "long", "medium" or "short"`);
        }

        if (!data.volume) {
            errors.push(`Signal volume invalid (must be integer percents)`);
        }

        data.entryPoints.forEach((entryPoint: Dictionary) => {
            if (entryPoint.errors.length) {
                errors.push(...entryPoint.errors);
            }

            delete entryPoint.errors;
        });

        data.takeProfitOrders.forEach((order: Dictionary) => {
            if (order.errors.length) {
                errors.push(...order.errors);
            }

            delete order.errors;
            order.type = 'take profit';
        });

        data.stopLossOrders.forEach((order: Dictionary) => {
            if (order.errors.length) {
                errors.push(...order.errors);
            }

            delete order.errors;
            order.type = 'stop loss';
        });

        const tpVolumes = data.takeProfitOrders.map((order: Dictionary) => order.volume);
        const tpSum = tpVolumes.reduce((acc: Big, volume: number) => acc.plus(volume), new Big(0));

        if (!tpSum.eq('1')) {
            errors.push(`Sum of all Take Profit orders must be 100% (actual ${tpSum.mul(100).toString()}`);
        }

        const slVolumes = data.takeProfitOrders.map((order: Dictionary) => order.volume);
        const slSum = slVolumes.reduce((acc: Big, volume: number) => acc.plus(volume), new Big(0));

        if (!slSum.eq('1')) {
            errors.push(`Sum of all Stop Loss orders must be 100% (actual ${slSum.mul(100).toString()}`);
        }

        const maxEntryPoint = Math.max(...data.entryPoints.map((ep: Dictionary) => ep.price));
        const minEntryPoint = Math.min(...data.entryPoints.map((ep: Dictionary) => ep.price));

        if (data.type === 'long') {
            for (const order of data.takeProfitOrders) {
                if (order.price <= maxEntryPoint) {
                    errors.push(
                        `All long TP orders must be above highest entry point, order price ${order.price} less then or equal to ${maxEntryPoint}`,
                    );
                }
            }

            for (const order of data.stopLossOrders) {
                if (order.price >= minEntryPoint) {
                    errors.push(
                        `All long SL orders must be under lowest entry point, order price ${order.price} greater then or equal to ${minEntryPoint}`,
                    );
                }
            }
        } else if (data.type === 'short') {
            for (const order of data.takeProfitOrders) {
                if (order.price >= minEntryPoint) {
                    errors.push(
                        `All short TP orders must be under lowest entry point, order price ${order.price} greater then or equal to ${minEntryPoint}`,
                    );
                }
            }

            for (const order of data.stopLossOrders) {
                if (order.price <= maxEntryPoint) {
                    errors.push(
                        `All short SL orders must be above highest entry point, order price ${order.price} less then or equal to ${maxEntryPoint}`,
                    );
                }
            }
        }

        return errors;
    }

    private async parseCsv(rows: string[]) {
        this.rows = rows.map((row, index) => {
            const [
                date,
                channel,
                title,
                type,
                risk,
                term,
                volume,
                entryPoints,
                takeProfitOrders,
                stopLossOrders,
                post,
            ] = row;

            const data: Dictionary = {
                order: index,
                date: parseDate(date),
                channel: {
                    name: channel,
                },
                title,
                ticker: title.toUpperCase().replace(/[^A-Z]/g, ''),
                type: type.toLowerCase(),
                risk: risk.toLowerCase(),
                term: term.toLowerCase(),
                volume: percentToDecimal(volume),
                entryPoints: this.parseEntryPoints(entryPoints),
                takeProfitOrders: this.parseOrders(takeProfitOrders),
                stopLossOrders: this.parseOrders(stopLossOrders),
                post,

                // Harcoded fields
                status: 'delayed',
                commentable: true,
                paid: true,

                errors: [],
            };

            data.errors = this.validateRow(data);

            return data;
        });

        console.log(JSON.stringify(this.rows));
    }

    private handleUpload(files: File[]) {
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
        const signals = this.selected
            .map(index => {
                const row = this.rows[index];

                if (row.saved) {
                    return null;
                }

                delete row.order;
                delete row.errors;

                row.entryPoints.forEach((ep: Dictionary) => {
                    delete ep.order;
                    delete ep.errors;
                });
                row.takeProfitOrders.forEach((order: Dictionary) => {
                    delete order.order;
                    delete order.errors;
                });
                row.stopLossOrders.forEach((order: Dictionary) => {
                    delete order.order;
                    delete order.errors;
                });

                return row;
            })
            .filter(item => !!item);

        const { signalsIds } = await api.uploadSignals(signals);

        if (!Array.isArray(signalsIds)) {
            this.$toasted.error(this.$t('Unable to uploade some signals') as string);
            return;
        }

        this.$toasted.success(this.$t('Signals successfully uploaded') as string);

        this.rows = this.rows.map((row: Dictionary, index: number) => {
            if (this.selected.includes(index)) {
                row.saved = true;
            }

            return row;
        });
    }
}
</script>
