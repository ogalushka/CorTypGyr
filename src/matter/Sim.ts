declare var Matter:any;

class Sim
{
    step:number = 1000/60;

    deltaTime:number = 0;
    engine;

    constructor()
    {
        var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body;

        this.engine = Engine.create();
        var world = this.engine.world;
        world.gravity.x = 0;
        world.gravity.y = 0;
        world.gravity.scale *= 10;
        
        var gameRadius = 420;
        var radiusStep = 55;

        var outerBounds =  Builder.buildCircleWallWithGap(new Vertex(512, 512), gameRadius, 10, 60, 0, 0, Bodies);
        var gapAngle = 90;
        for (var radius = gameRadius - radiusStep; radius > 100; radius -= radiusStep, gapAngle = (gapAngle + 180) % 360)
        {
            var bodies = Builder.buildCircleWallWithGap(new Vertex(512, 512), radius, 10, 60, gapAngle, 42, Bodies);
            World.add(world, bodies);
        }
        World.add(world, outerBounds);


        World.add(world, Bodies.circle(512, 512 + 380, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
        World.add(world, Bodies.circle(512-10, 512 + 380, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
        World.add(world, Bodies.circle(512+10, 512 + 380, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
        World.add(world, Bodies.circle(512+15, 512 + 375, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
        World.add(world, Bodies.circle(512-15, 512 + 375, 20, { friction: 0, restitution: 0.5, density: 0.000001 }));
    }

    setGravity(x:number, y:number)
    {
        this.engine.world.gravity.x = x;
        this.engine.world.gravity.y = y;
    }

    update(dt:number)
    {
        this.deltaTime += dt;
        while(this.deltaTime > this.step)
        {
            Matter.Engine.update(this.engine, this.step);
            this.deltaTime -= this.step;
        }
    }

    render(context:CanvasRenderingContext2D)
    {
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
    }
}