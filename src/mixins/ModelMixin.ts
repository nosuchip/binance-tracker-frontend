import { Vue, Component, Model, Watch } from 'vue-property-decorator';
import { Dictionary } from '@/types/base';

@Component
export default class ModelMixin<T> extends Vue {
    @Model('change')
    readonly value!: T;

    get model() {
        return this.value;
    }

    set model(newModel) {
        this.$emit('input', newModel);
    }

    @Watch('model', { deep: true })
    onModelChanged() {
        (this.model as Dictionary).changed = true;
        // this.$emit('input', this.model);
    }
}
