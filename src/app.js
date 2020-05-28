import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import Verte from 'verte';
import 'verte/dist/verte.css';

var app = new Vue({
    el: '#app',
    components: {Verte},
    data: {
        directions: [
            {value: 'H', text: 'Horizontal [H]'},
            {value: 'V', text: 'Vertical [V]'},
            {value: '1', text: 'Oblicua 1 [1]'},
            {value: '2', text: 'Oblicua 2 [2]'}
        ],
        direction: 'H',
        speed: 50,
        duration: 30,
        width: 30,
        background: 'rgb(0,0,0)',
        foreground: 'rgb(255,0,0)',
        sound: false,
        menu: true,
        fullscreen: false,
        isRun: false
    },
    methods: {
        durationFormatter(value) {
            return value + "s"
        },
        speedFormatter(value) {
            return value + "rpm"
        },
        widthFormatter(value) {
            return value + "px"
        },
        reset() {
            this.isRun = false;
        }
    }
})