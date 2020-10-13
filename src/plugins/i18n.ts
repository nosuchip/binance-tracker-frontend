import Vue from 'vue';
import VueI18n from 'vue-i18n';

import ru from './translations/ru.json';

Vue.use(VueI18n);

export const messages = {
    ru
}

export default new VueI18n({
    locale: 'ru',
    messages
});
