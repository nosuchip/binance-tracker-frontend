import Vue from 'vue';
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
    duration: 1000,
    keepOnHover: true,
    position: 'bottom-center',
    fullWidth: true,
});
