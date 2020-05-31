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
            {value: '2', text: 'Oblicua 2 [2]'},
        ],
        direction: 'H',
        speed: 60,
        durationTotal: 30,
        startRun: 0,
        runDirection: 0,
        width: 30,
        background: 'rgb(0,0,0)',
        foreground: 'rgb(255,0,0)',
        sound: false,
        menu: true,
        fullscreen: false,
        isRun: false,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        squareActive: 1,
        intervalHandler: null,
    },
    computed: {
        squareNumber: function () {
            return Math.floor(this.windowWidth / this.width);
        },
        changeInterval: function () {
            return (((60 / this.speed) / this.squareNumber) * 1000);
        }
    },
    methods: {
        durationTotalFormatter(value) {
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
            this.squareActive = 1;
            this.startRun = 0;
            this.runDirection = 0;
        },
        nextSquare() {
            if (this.squareActive <= 1) {
                this.runDirection = 0;
                this.squareActive = 1;
            }
            if (this.squareActive >= this.squareNumber) {
                this.runDirection = 1;
                this.squareActive = this.squareNumber;
            }
            if (this.runDirection == 0) {
                this.squareActive++;
            } else {
                this.squareActive--;
            }
            var self = this;
            this.intervalHandler = setTimeout(function () {
                self.nextSquare();
            }, this.changeInterval);
        },
    },
    watch: {
        isRun: function (val) {
            if (val == true) {
                this.nextSquare();
            } else {
                clearTimeout(this.intervalHandler);
            }
        },
    },
    mounted() {
        window.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 13: //Enter
                case 32: //space
                    this.isRun = !this.isRun;
                    break;
                case 115: //s
                case 83: //S
                    this.sound = !this.sound;
                    break;
                case 114://r
                case 82: //R
                    this.reset();
                    break;
                case 37: //ArrowLeft
                    if (this.durationTotal > 1) {
                        this.durationTotal--;
                    }
                    break;
                case 39: //ArrowRight
                    if (this.durationTotal < 999) {
                        this.durationTotal++;
                    }
                    break;
                case 38: //ArrowUp
                case 107: //+
                case 187: //+
                    if (this.speed < 240) {
                        this.speed++;
                    }
                    break;
                case 40: //ArrowDown
                case 109: //-
                case 189: //-
                    if (this.speed > 1) {
                        this.speed--;
                    }
                    break;
                case 77: //m
                    this.menu = !this.menu;
                    break;
                default:
                    console.log(e);
                    break;
            }
        }.bind(this));
        window.addEventListener("resize", function (e) {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
        }.bind(this));
    }
})