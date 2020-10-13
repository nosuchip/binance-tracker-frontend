<template>
    <v-dialog class="Popup" v-model="model" max-width="290">
        <v-card>
            <v-card-title class="headline" v-if="title" v-html="title"></v-card-title>

            <v-card-text v-html="text"></v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" text @click.stop="model = false">
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';

@Component({
    components: {},
})
export default class Popup extends Mixins<ModelMixin<boolean>>(ModelMixin) {
    @Prop({ type: String, required: false })
    title!: string;

    @Prop({ type: String, required: true })
    text!: string;
}
</script>
