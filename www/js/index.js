var Game = /** @class */ (function () {
    function Game(message) {
        this.lastTS = 0;
        this.orientation = new Orientation();
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.sim = new Sim();
        screen.orientation.lock("portrait");
        window.requestAnimationFrame(this.draw.bind(this));
        window.addEventListener("deviceorientation", this.updateOrientation.bind(this), true);
    }
    Game.prototype.updateOrientation = function (event) {
        this.orientation.fromEvent(event);
        this.sim.setGravity(this.orientation.gamma, this.orientation.beta);
    };
    Game.prototype.draw = function (ts) {
        var dt = ts - this.lastTS;
        this.lastTS = ts;
        this.context.fillStyle = "rgba(0, 255, 255, 255)";
        this.context.fillRect(0, 0, this.width, this.height);
        this.sim.update(dt);
        this.sim.render(this.context);
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
        this.beta = event.beta / 90;
        this.gamma = event.gamma / 90;
    };
    return Orientation;
}());
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    new Game("Hello worldddd");
}
var Player = /** @class */ (function () {
    function Player() {
    }
    return Player;
}());
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector;
}());
var Builder = /** @class */ (function () {
    function Builder() {
    }
    Builder.buildCircleWall = function (outerR, innerR, sections) {
        var result = [];
        var angleStep = (2 * Math.PI) / sections;
        var centerR = (outerR + innerR) / 2;
        // inner
        for (var i = 0; i < sections; i++) {
            var angle = angleStep * i;
            var angleNext = angleStep * (i + 1);
            //    4_3
            //    //
            //   //
            //  1 2
            //inner first
            var v1 = new Vertex();
            v1.x = Math.cos(angle) * innerR;
            v1.y = Math.sin(angle) * innerR;
            //outer first
            var v2 = new Vertex();
            v2.x = Math.cos(angle) * outerR;
            v2.y = Math.sin(angle) * outerR;
            //outer second
            var v3 = new Vertex();
            v3.x = Math.cos(angleNext) * outerR;
            v3.y = Math.sin(angleNext) * outerR;
            //inner second
            var v4 = new Vertex();
            v4.x = Math.cos(angleNext) * innerR;
            v4.y = Math.sin(angleNext) * innerR;
            result.push([v1, v2, v3, v4]);
            /*var x = Math.cos(angle) * innerR;
            var y = Math.sin(angle) * innerR;
            result.push(new Vertex(x, y));*/
        }
        return result;
    };
    return Builder;
}());
var Sim = /** @class */ (function () {
    function Sim() {
        var Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Body = Matter.Body;
        this.engine = Engine.create();
        var world = this.engine.world;
        //world.gravity.x = 0;
        //world.gravity.y = 0;
        //World.add(world, Bodies.circle(600, 150, 40));
        var innerRadius = 100;
        var outerRadius = 110;
        var sections = 10;
        var wallVertices = Builder.buildCircleWall(innerRadius, outerRadius, sections);
        //var walls = wallVertices.map(v => Bodies.fromVertices(550, 200, v, {isStatic: true}));
        //var walls = wallVertices.map(v => Body.create({isStatic: true, position: {x:550, y:200}, vertices: v}));
        //var body = Body.create({parts: walls});
        World.add(world, Bodies.fromVertices(550, 200, wallVertices, { isStatic: true }));
        //World.add(walls);
    }
    Sim.prototype.setGravity = function (x, y) {
        this.engine.world.gravity.x = x;
        this.engine.world.gravity.y = y;
    };
    Sim.prototype.update = function (dt) {
        Matter.Engine.update(this.engine, dt);
    };
    Sim.prototype.render = function (context) {
        var bodies = Matter.Composite.allBodies(this.engine.world);
        context.fillStyle = '#fff';
        context.beginPath();
        for (var i = 0; i < bodies.length; i += 1) {
            var vertices = bodies[i].vertices;
            context.moveTo(vertices[0].x, vertices[0].y);
            for (var j = 1; j < vertices.length; j += 1) {
                context.lineTo(vertices[j].x, vertices[j].y);
            }
            context.lineTo(vertices[0].x, vertices[0].y);
        }
        context.lineWidth = 1;
        context.strokeStyle = '#999';
        context.stroke();
    };
    return Sim;
}());
var Vertex = /** @class */ (function () {
    function Vertex(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Vertex;
}());
