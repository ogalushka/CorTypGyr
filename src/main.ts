document.addEventListener('deviceready', onDeviceReady, false);

var game:Game;
function onDeviceReady() {
    game = new Game(new Color(10, 255, 255));
}