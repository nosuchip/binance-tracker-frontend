<template>
    <tr :class="`PublicSignalRow ${odd ? 'odd' : ''}`">
        <td>
            <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                    <v-icon color="grey lighten-1" v-bind="attrs" v-on="on">
                        mdi-information-variant
                    </v-icon>
                </template>
                <span>{{ tooltip }}</span>
            </v-tooltip>
        </td>
        <td>{{ model.title || model.ticker }}</td>
        <td>
            <div class="d-flex flex-column">
                <div class="published-at-data">
                    {{ model.createdAt | dayjs('format', 'HH:mm DD.MM.YYYY') }}
                </div>
                <div class="updated-at-data font-small">
                    {{ $t('updated at') }} {{ model.updatedAt | dayjs('format', 'HH:mm DD.MM.YYYY') }}
                </div>
            </div>
        </td>
        <td>{{ model.price || '-' }}</td>
        <td>
            <div class="d-flex flex-column">
                <div class="current-price">
                    {{ model.lastPrice || '-' }}
                </div>
                <div class="remainings">{{ $t('remains in position') }}: {{ remainings }}</div>
            </div>
        </td>
        <td>{{ profitability }}</td>
        <td>
            {{ status }}
            <v-btn icon x-small @click.stop="showSignalStatusHelp = true">
                <v-icon dark>mdi-information-outline</v-icon>
            </v-btn>
            <popup v-model="showSignalStatusHelp" :title="$t('Signal statuses')" :text="$t('statusesHelp')" />
        </td>
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
                    {{ $t('Details') }}
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
import _get from 'lodash/get';
import { State } from 'vuex-class';
import { UserInfo } from '@/types/user-info';
import Popup from '@/components/Popup.vue';

@Component({
    components: {
        Popup,
    },
    mixins: [ModelMixin],
})
export default class SignalRow extends Mixins<ModelMixin<Signal>>(ModelMixin) {
    private showSignalStatusHelp = false;

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

    get tooltip() {
        if (this.model.comment_localized) {
            const { key, ...rest } = this.model.comment_localized;

            if (!rest.title) {
              rest.title = rest.ticker;
            }

            return this.$t(key, rest) as string;
        }

        if (this.model.comment) {
            return this.model.comment;
        }

        return this.model.title || this.model.ticker;
    }
}
</script>
