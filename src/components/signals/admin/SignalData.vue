<template>
    <v-form ref="form" v-model="formValid">
        <v-row class="SignalData">
            <v-col cols="12">
                <v-text-field
                    v-model="model.ticker"
                    :rules="requiredRules"
                    :label="$t('Ticker')"
                    required
                    hide-details="auto"
                    :disabled="disabled"
                ></v-text-field>
            </v-col>

            <v-col cols="12">
                <v-text-field
                    v-model="model.title"
                    :label="$t('Title')"
                    :hint="$t('edit.title_hint')"
                    persistent-hint
                    :disabled="disabled"
                ></v-text-field>
            </v-col>

            <v-col cols="12">
                <v-text-field
                    v-model="model.channel"
                    :label="$t('Channel')"
                    :hint="$t('edit.channel_hint')"
                    persistent-hint
                    :disabled="disabled"
                ></v-text-field>
            </v-col>

            <v-col cols="12">
                <v-select
                    :label="$t('Type')"
                    v-model="model.type"
                    :items="typesOptions"
                    hide-details="auto"
                    required
                    :disabled="disabled"
                ></v-select>
            </v-col>

            <v-col cols="12">
                <v-select
                    :label="$t('Risk')"
                    v-model="model.risk"
                    :items="riskOptions"
                    hide-details="auto"
                    required
                    :disabled="disabled"
                ></v-select>
            </v-col>

            <v-col cols="12">
                <v-select
                    :label="$t('Terms')"
                    v-model="model.term"
                    :items="termsOptions"
                    hide-details="auto"
                    required
                    :disabled="disabled"
                ></v-select>
            </v-col>

            <v-col cols="12">
                <v-text-field
                    v-model.number="model.volume"
                    :label="$t('Volume')"
                    required
                    hide-details="auto"
                    append-icon="mdi-information-outline"
                    @click:append.stop="showVolumeInfo = true"
                    :disabled="disabled"
                ></v-text-field>

                <popup v-model="showVolumeInfo" :title="$t('Recommended volume')" text="Blah-blah-blah" />
            </v-col>

            <v-col cols="12">
                <v-checkbox
                    v-model="model.paid"
                    :label="$t('Paid signal')"
                    :hint="$t('edit.paid_signal_hint')"
                    persistent-hint
                    required
                    :disabled="disabled"
                ></v-checkbox>
            </v-col>

            <v-col cols="12">
                <v-checkbox
                    v-model="model.commentable"
                    :label="$t('Comments')"
                    :hint="$t('edit.comments_hint')"
                    persistent-hint
                    required
                    :disabled="disabled"
                ></v-checkbox>
            </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';
import ValidateableMixin from '@/mixins/ValidateableMixin';
import { Signal } from '@/types/signals';
import Popup from '@/components/Popup.vue';

@Component({
    components: { Popup },
    mixins: [ModelMixin, ValidateableMixin],
})
export default class SignalData extends Mixins<ModelMixin<Signal>, ValidateableMixin>(ModelMixin, ValidateableMixin) {
    private showVolumeInfo = false;
    private requiredRules = [(s: string) => !!s || 'Field is required'];

    private readonly typesOptions = [
        { value: 'long', text: this.$t('Long') },
        { value: 'short', text: this.$t('Short') },
    ];

    private readonly riskOptions = [
        { value: 'high', text: this.$t('High') },
        { value: 'medium', text: this.$t('Medium') },
        { value: 'low', text: this.$t('Low') },
    ];

    private readonly termsOptions = [
        { value: 'short', text: this.$t('Short') },
        { value: 'medium', text: this.$t('Medium') },
        { value: 'long', text: this.$t('Long') },
    ];

    @Prop({ type: Boolean, required: false })
    disabled!: boolean;
}
</script>
