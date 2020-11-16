class Game
{
    lastTS:number;
    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;
    width:number;
    height:number;
    orientation:Orientation;
    sim:Sim;
    bgColor:Color;

    constructor(backgroundColor:Color)
    {
        this.orientation = new Orientation();
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
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

    handleMouseMove(event)
    {
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
    }

    updateOrientation(event)
    {
        this.orientation.fromEvent(event);
        this.sim.setGravity(this.orientation.gamma, this.orientation.beta);
    }

    draw(ts)
    {
        var dt = 0;
        if (this.lastTS)
        {
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
    }
}