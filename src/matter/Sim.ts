declare var Matter:any;

class Sim
{
    engine;

    constructor()
    {
        var Engine = Matter.Engine,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body;

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
        World.add(world, Bodies.fromVertices(550, 200, wallVertices, {isStatic: true}));
        //World.add(walls);
    }

    setGravity(x:number, y:number)
    {
        this.engine.world.gravity.x = x;
        this.engine.world.gravity.y = y;
    }

    update(dt:number)
    {
        Matter.Engine.update(this.engine, dt);
    }

    render(context:CanvasRenderingContext2D)
    {
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
    }
}