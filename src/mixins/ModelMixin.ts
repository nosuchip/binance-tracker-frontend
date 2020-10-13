import { Vue, Component, Model } from 'vue-property-decorator';
import { Changeable } from '@/types/base';

@Component
export default class ModelMixin<T> extends Vue {
    @Model('change')
    readonly value!: T;

    get model() {
        return this.value;
    }

    set model(newModel) {
        const asChangeable = this.model as Changeable;

        if (Object.prototype.hasOwnProperty.call(asChangeable, 'changed')) {
            asChangeable.changed = true;
        }

        this.$emit('input', newModel);
    }

    // @Watch('model', { deep: true })
    // onModelChanged() {
    //     (this.model as Dictionary).changed = true;
    //     // this.$emit('input', this.model);
    // }
}
