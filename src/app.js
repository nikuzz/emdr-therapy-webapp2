import Vue from 'vue';
import { BootstrapVue, BButton } from 'bootstrap-vue';
Vue.component('b-button', BButton)
Vue.use(BootstrapVue);
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
        speed: 120,
        durationTotal: 30,
        startRun: 0,
        startRound: 0,
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
        circle: false,
        roundProgress: null,
    },
    computed: {
        squareNumber: function () {
            return Math.min(Math.floor(this.windowWidth / this.width), Math.ceil(this.windowWidth / this.speed));
        },
        roundInterval: function () {
            return (((60 / this.speed)) * 1000);
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
            this.startRun = null;
            this.startRound = null;
            this.runDirection = 0;
            this.squareActive = 1;
        },
        nextSquare(timestamp) {
            if (!this.isRun) {
                return;
            }
            if (!this.startRun) {
                this.startRun = timestamp;
                this.startRound = timestamp;
            }

            this.roundProgress = (timestamp - this.startRound) / this.roundInterval;

            if (this.runDirection == 0) {
                var nextSquareActive = Math.ceil(this.roundProgress * this.squareNumber);
                if (nextSquareActive >= this.squareNumber) {
                    this.startRound = timestamp;
                    this.runDirection = 1;
                    this.squareActive = this.squareNumber;
                    if (this.sound) {
                        playSound("right");
                    }
                } else {
                    this.squareActive = nextSquareActive;
                }
            } else {
                var nextSquareActive = Math.ceil((1 - this.roundProgress) * this.squareNumber);
                if (nextSquareActive <= 1) {
                    this.startRound = timestamp;
                    this.runDirection = 0;
                    this.squareActive = 1;
                    if (this.sound) {
                        playSound("left");
                    }
                } else {
                    this.squareActive = nextSquareActive;
                }
            }
            window.requestAnimationFrame(this.nextSquare);
        },
        close() {
            document.exitFullscreen();
        },
    },
    watch: {
        isRun: function (val) {
            if (val) {
                this.menu = false;
                this.startRun = null;
                if (document.fullscreenEnabled) {
                    document.documentElement.requestFullscreen();
                }
                if (this.sound) {
                    playSound("left");
                }
                window.requestAnimationFrame(this.nextSquare);
            } else {
                this.menu = true;
                this.reset();
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
                case 27: // ESC
                    this.isRun = false;
                    break;
                case 83: //S
                    this.sound = !this.sound;
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
                case 67: //c
                    this.circle = !this.circle;
                    break;
                case 72: //h
                    this.direction = 'H';
                    break;
                case 86: //v
                    this.direction = 'V';
                    break;
                case 49: //1
                case 97: //1
                    this.direction = '1';
                    break;
                case 50: //2
                case 98: //2
                    this.direction = '2';
                    break;
                default:
                    break;
            }
        }.bind(this));
        window.addEventListener("resize", function (e) {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
        }.bind(this));
    }
});

// https://jsfiddle.net/teropa/bwxwhoqr/1/
const LENGTH_MS = 100;

const REAL_TIME_FREQUENCY = 442;
const ANGULAR_FREQUENCY = REAL_TIME_FREQUENCY * 2 * Math.PI;
const LENGTH = (LENGTH_MS / 1000) * 44100;

let audioContext = new AudioContext();
let myLeftChannelBuffer = audioContext.createBuffer(2, LENGTH, 44100); // 2 channels
let myRightChannelBuffer = audioContext.createBuffer(2, LENGTH, 44100); // 2 channels
let myLeftArray = myLeftChannelBuffer.getChannelData(0);
let myRightArray = myRightChannelBuffer.getChannelData(1);
for (let sampleNumber = 0; sampleNumber < LENGTH; sampleNumber++) {
    myLeftArray[sampleNumber] = generateSample(sampleNumber);
    myRightArray[sampleNumber] = generateSample(sampleNumber);
}

function generateSample(sampleNumber) {
    let currentTime = sampleNumber / 44100;
    let currentAngle = currentTime * ANGULAR_FREQUENCY;
    return Math.sin(currentAngle);
}

function playSound(channel) {
    let src = audioContext.createBufferSource();
    if (channel == 'left') {
        src.buffer = myLeftChannelBuffer;
    } else if (channel == 'right') {
        src.buffer = myRightChannelBuffer;
    }
    src.connect(audioContext.destination);
    src.start();
}
