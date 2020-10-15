<template>
    <div class="Pagination">
        <v-pagination
            v-model="model.page"
            class="my-4"
            :length="length"
            @input="handlePageChange"
            @next="handleNext"
            @previous="handlePrev"
        ></v-pagination>
    </div>
</template>

<style lang="scss" scoped>
.Pagination {
    display: flex;
    justify-content: flex-end;
}
</style>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import ModelMixin from '@/mixins/ModelMixin';
import Popup from '@/components/Popup.vue';
import ListOrderRow from '@/components/signals/admin/ListOrderRow.vue';
import { Pagination } from '@/types/pagination';

@Component({
    components: {
        Popup,
        ListOrderRow,
    },
    mixins: [ModelMixin],
})
export default class ListSignalRow extends Mixins<ModelMixin<Pagination>>(ModelMixin) {
    @Prop({ type: Function, required: true })
    onPage!: (page: number) => void;

    @Prop({ type: Function, required: false })
    onNext?: (page: number) => void;

    @Prop({ type: Function, required: false })
    onPrev?: (page: number) => void;

    get length() {
        return Math.ceil(this.model.total / this.model.perPage);
    }

    private handlePageChange() {
        this.onPage(this.model.page);
    }

    private handleNext() {
        if (!this.model.hasNext) {
            return;
        }

        this.model.page += 1;

        if (this.onNext) {
            this.onNext(this.model.page);
        } else {
            this.onPage(this.model.page);
        }
    }

    private handlePrev() {
        if (!this.model.hasPrev) {
            return;
        }

        this.model.page -= 1;

        if (this.onPrev) {
            this.onPrev(this.model.page);
        } else {
            this.onPage(this.model.page);
        }
    }
}
</script>
