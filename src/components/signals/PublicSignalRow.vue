<template>
    <tr :class="`PublicSignalRow ${odd ? 'odd' : ''}`">
        <td>{{ model.ticker }}</td>
        <td>
            <div class="d-flex flex-column">
                <div class="published-at-data">
                    {{ model.createdAt | dayjs('format', 'DD.MM.YYYY HH:mm') }}
                </div>
                <div class="updated-at-data font-small">
                    updated at {{ model.updateddAt | dayjs('format', 'DD.MM.YYYY HH:mm') }}
                </div>
            </div>
        </td>
        <td>{{ model.price }}</td>
        <td>{{ model.profitability }}</td>
        <td>{{ model.status }}</td>
        <td class="details">
            <v-badge color="green" overlap :content="comments">
                <v-btn
                    :disabled="!accessible"
                    small
                    color="warning"
                    class="details-button"
                    :to="accessible ? { name: 'signal-view', params: { signalId: model.id } } : ''"
                >
                    <v-icon small v-if="!accessible">mdi-lock</v-icon>
                    Details
                </v-btn>
            </v-badge>
        </td>
    </tr>
</template>

<style lang="scss" scoped>
.PublicSignalRow {
    td {
        text-align: right;
    }

    .updated-at-data {
        font-weight: 200;
        font-size: 11px;
    }

    &.odd {
        background-color: #f9f9f9;
    }

    .details {
        .details-button {
            width: 100px;
        }
    }
}
</style>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';
import { Signal } from '@/types/signals';
import _get from 'lodash/get';
import { State } from 'vuex-class';
import { UserInfo } from '@/types/user-info';

@Component({
    components: {},
    mixins: [ModelMixin],
})
export default class SignalRow extends Mixins<ModelMixin<Signal>>(ModelMixin) {
    @State('user')
    user!: UserInfo | null;

    @Prop({ default: false })
    odd!: boolean;

    get comments() {
        return (_get(this.model.comments, 'length') || 0).toString();
    }

    get accessible() {
        return !this.model.paid || (this.user && ['admin', 'paid user'].includes(this.user.role));
    }
}
</script>
