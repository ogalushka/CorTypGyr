var Game = /** @class */ (function () {
    function Game(message) {
        this.orientation = new Orientation();
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        screen.orientation.lock("portrait");
        document.documentElement.requestFullscreen();
        window.requestAnimationFrame(this.draw.bind(this));
        window.addEventListener("deviceorientation", this.updateOrientation.bind(this), true);
    }
    Game.prototype.updateOrientation = function (event) {
        this.orientation.fromEvent(event);
        document.getElementById("alpha").innerText = this.orientation.alpha.toString();
        document.getElementById("beta").innerText = this.orientation.beta.toString();
        document.getElementById("gamma").innerText = this.orientation.gamma.toString();
    };
    Game.prototype.draw = function (dt) {
        this.context.fillStyle = "rgba(0, 255, 255, 255)";
        this.context.fillRect(0, 0, this.width, this.height);
        var centerX = this.width / 2;
        var centerY = this.height / 2;
        var indicationX = this.orientation.gamma;
        var indicationY = this.orientation.beta;
        this.context.fillStyle = "rgba(255, 0, 0, 255)";
        this.context.fillRect(indicationX + centerX - 5, indicationY + centerY - 5, 10, 10);
        window.requestAnimationFrame(this.draw.bind(this));
    };
    return Game;
}());
var Orientation = /** @class */ (function () {
    function Orientation() {
        this.alpha = 0;
        this.beta = 0;
        this.gamma = 0;
    }
    Orientation.prototype.fromEvent = function (event) {
        this.alpha = event.alpha;
        this.beta = event.beta;
        this.gamma = event.gamma;
    };
    return Orientation;
}());
//import Game from './Game';
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    new Game("Hello world");
}
