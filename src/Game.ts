class Game
{
    lastTS:number;
    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;
    width:number;
    height:number;
    orientation:Orientation;

    constructor(message:string)
    {
        this.orientation = new Orientation();
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        screen.orientation.lock("portrait");
        document.documentElement.requestFullscreen();
        window.requestAnimationFrame(this.draw.bind(this));
        window.addEventListener("deviceorientation", this.updateOrientation.bind(this), true);
    }

    updateOrientation(event)
    {
        this.orientation.fromEvent(event);
        document.getElementById("alpha").innerText = this.orientation.alpha.toString();
        document.getElementById("beta").innerText = this.orientation.beta.toString();
        document.getElementById("gamma").innerText = this.orientation.gamma.toString();
    }

    draw(dt)
    {
        this.context.fillStyle = "rgba(0, 255, 255, 255)";
        this.context.fillRect(0, 0, this.width, this.height);
        
        var centerX = this.width / 2;
        var centerY = this.height / 2;

        var indicationX = this.orientation.gamma;
        var indicationY = this.orientation.beta;

        this.context.fillStyle = "rgba(255, 0, 0, 255)";
        this.context.fillRect(indicationX+centerX-5, indicationY+centerY-5, 10, 10);

        window.requestAnimationFrame(this.draw.bind(this));
    }
}