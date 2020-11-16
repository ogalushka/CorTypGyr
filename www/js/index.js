var Color = /** @class */ (function () {
    /**
     *
     * @param r red from 0 to 255 (default 0)
     * @param g green from 0 to 255 (default 0)
     * @param b blue from 0 to 255 (default 0)
     * @param a alpha from 0 to 255 (default 255)
     */
    function Color(r, g, b, a) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        if (a === void 0) { a = 255; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    Color.prototype.asCanvasString = function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };
    Color.prototype.asCSSString = function () {
        var value = (this.r << 16) | (this.g << 8) | this.b;
        var string = ("000000" + value.toString(16)).substr(-6);
        return "#" + string;
    };
    return Color;
}());
var Game = /** @class */ (function () {
    function Game(backgroundColor) {
        this.orientation = new Orientation();
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.sim = new Sim();
        this.bgColor = backgroundColor;
        var canvasXScale = window.innerWidth / this.width;
        var canvasYScale = window.innerHeight / this.height;
        var scale = Math.min(canvasXScale, canvasYScale);
        this.canvas.style.width = (this.width * scale) + "px";
        this.canvas.style.height = (this.height * scale) + "px";
        document.body.style.backgroundColor = this.bgColor.asCSSString();
        console.log(this.bgColor.asCSSString());
        screen.orientation.lock("portrait");
        window.requestAnimationFrame(this.draw.bind(this));
        window.addEventListener("deviceorientation", this.updateOrientation.bind(this), true);
        document.onmousemove = this.handleMouseMove.bind(this);
    }
    Game.prototype.handleMouseMove = function (event) {
        //temp hacks for testing
        var width = 2000;
        var height = 1024;
        var centerX = width / 2;
        var centerY = height / 2;
        var mouseX = event.pageX - centerX;
        var mouseY = event.pageY - centerY;
        var gravityXN = mouseX / centerX;
        var gravityYN = mouseY / centerY;
        var gravityStrength = 2;
        this.sim.setGravity(gravityXN * gravityStrength, gravityYN * gravityStrength);
    };
    Game.prototype.updateOrientation = function (event) {
        this.orientation.fromEvent(event);
        this.sim.setGravity(this.orientation.gamma, this.orientation.beta);
    };
    Game.prototype.draw = function (ts) {
        var dt = 0;
        if (this.lastTS) {
            var dt = ts - this.lastTS;
        }
        this.lastTS = ts;
        this.context.fillStyle = this.bgColor.asCanvasString();
        this.context.fillRect(0, 0, this.width, this.height);
        this.sim.update(dt);
        this.sim.render(this.context);
        /*
        var centerX = this.width / 2;
        var centerY = this.height / 2;

        var indicationX = this.orientation.gamma;
        var indicationY = this.orientation.beta;

        this.context.fillStyle = "rgba(255, 0, 0, 255)";
        this.context.fillRect(indicationX+centerX-5, indicationY+centerY-5, 10, 10);
        */
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
var game;
function onDeviceReady() {
    game = new Game(new Color(10, 255, 255));
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
    Builder.buildCircleWall = function (position, outerR, innerR, sections, bodies) {
        var result = [];
        var angleStep = (2 * Math.PI) / sections;
        var centerR = (outerR + innerR) / 2;
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
            var centerAngle = angle + (angleStep / 2);
            var c = new Vertex();
            c.x = Math.cos(centerAngle) * centerR + position.x;
            c.y = Math.sin(centerAngle) * centerR + position.y;
            result.push(bodies.fromVertices(c.x, c.y, [v1, v2, v3, v4], { isStatic: true }));
        }
        return result;
    };
    Builder.buildCircleWallWithGap = function (position, outerR, thikness, sections, gapAngle, gapSize, bodies) {
        var result = [];
        var innerR = outerR - thikness;
        var centerR = (outerR + innerR) / 2;
        var gapSizeRad = gapSize / innerR;
        var gapRad = gapAngle * Math.PI / 180;
        var gapStart = gapRad - (gapSizeRad / 2);
        //var sections = Math.ceil(((2 * Math.PI * outerR) - gapSize) / sectionSize);
        var angleStep = ((2 * Math.PI) - gapSizeRad) / sections;
        for (var i = 0; i < sections; i++) {
            var angle = gapStart + angleStep * i;
            var angleNext = angle + angleStep;
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
            var centerAngle = angle + (angleStep / 2);
            var c = new Vertex();
            c.x = Math.cos(centerAngle) * centerR + position.x;
            c.y = Math.sin(centerAngle) * centerR + position.y;
            result.push(bodies.fromVertices(c.x, c.y, [v1, v2, v3, v4], { isStatic: true }));
        }
        return result;
    };
    return Builder;
}());
var Sim = /** @class */ (function () {
    function Sim() {
        this.step = 1000 / 60;
        this.deltaTime = 0;
        var Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Body = Matter.Body;
        this.engine = Engine.create();
        var world = this.engine.world;
        world.gravity.x = 0;
        world.gravity.y = 0;
        world.gravity.scale *= 10;
        var gameRadius = 420;
        var radiusStep = 55;
        var outerBounds = Builder.buildCircleWallWithGap(new Vertex(512, 512), gameRadius, 10, 60, 0, 0, Bodies);
        var gapAngle = 90;
        for (var radius = gameRadius - radiusStep; radius > 100; radius -= radiusStep, gapAngle = (gapAngle + 180) % 360) {
            var bodies = Builder.buildCircleWallWithGap(new Vertex(512, 512), radius, 10, 60, gapAngle, 42, Bodies);
            World.add(world, bodies);
        }
        World.add(world, outerBounds);
        World.add(world, Bodies.circle(512, 512 + 380, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
        World.add(world, Bodies.circle(512 - 10, 512 + 380, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
        World.add(world, Bodies.circle(512 + 10, 512 + 380, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
        World.add(world, Bodies.circle(512 + 15, 512 + 375, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
        World.add(world, Bodies.circle(512 - 15, 512 + 375, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
    }
    Sim.prototype.setGravity = function (x, y) {
        this.engine.world.gravity.x = x;
        this.engine.world.gravity.y = y;
    };
    Sim.prototype.update = function (dt) {
        this.deltaTime += dt;
        while (this.deltaTime > this.step) {
            Matter.Engine.update(this.engine, this.step);
            this.deltaTime -= this.step;
        }
    };
    Sim.prototype.render = function (context) {
        var bodies = Matter.Composite.allBodies(this.engine.world);
        context.fillStyle = '#fff';
        context.lineWidth = 1;
        context.strokeStyle = '#999';
        context.beginPath();
        for (var i = 0; i < bodies.length; i += 1) {
            var vertices = bodies[i].vertices;
            context.moveTo(vertices[0].x, vertices[0].y);
            for (var j = 1; j < vertices.length; j += 1) {
                context.lineTo(vertices[j].x, vertices[j].y);
            }
            context.lineTo(vertices[0].x, vertices[0].y);
        }
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
