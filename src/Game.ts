class Game
{
    lastTS:number = 0;
    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;
    width:number;
    height:number;
    orientation:Orientation;
    sim:Sim;

    constructor(message:string)
    {
        this.orientation = new Orientation();
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.sim = new Sim();

        screen.orientation.lock("portrait");
        window.requestAnimationFrame(this.draw.bind(this));
        window.addEventListener("deviceorientation", this.updateOrientation.bind(this), true);
    }

    updateOrientation(event)
    {
        this.orientation.fromEvent(event);
        this.sim.setGravity(this.orientation.gamma, this.orientation.beta);
    }

    draw(ts)
    {
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
        this.context.fillRect(indicationX+centerX-5, indicationY+centerY-5, 10, 10);

        window.requestAnimationFrame(this.draw.bind(this));
    }
}