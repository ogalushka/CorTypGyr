class Builder
{
    static buildCircleWall(position:Vertex, outerR:number, innerR:number, sections:number, bodies:any):any[]
    {
        var result = [];
        var angleStep = (2 * Math.PI) / sections;
        var centerR = (outerR + innerR) / 2;

        for (var i = 0; i < sections; i++)
        {
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
            var c =  new Vertex();
            c.x = Math.cos(centerAngle) * centerR + position.x;
            c.y = Math.sin(centerAngle) * centerR + position.y;

            

            result.push(bodies.fromVertices(c.x, c.y, [v1, v2, v3, v4], {isStatic:true}));
        }

        return result;
    }

    static buildCircleWallWithGap(position:Vertex, outerR:number, thikness:number, sections:number, gapAngle:number, gapSize:number, bodies:any):any[]
    {
        var result = [];

        var innerR = outerR - thikness;
        var centerR = (outerR + innerR) / 2;

        var gapSizeRad = gapSize / innerR;

        var gapRad = gapAngle * Math.PI/180;
        
        var gapStart = gapRad - (gapSizeRad / 2);
        //var sections = Math.ceil(((2 * Math.PI * outerR) - gapSize) / sectionSize);
        var angleStep = ((2 * Math.PI) - gapSizeRad) / sections;

        for (var i = 0; i < sections; i++)
        {
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
            var c =  new Vertex();
            c.x = Math.cos(centerAngle) * centerR + position.x;
            c.y = Math.sin(centerAngle) * centerR + position.y;

            result.push(bodies.fromVertices(c.x, c.y, [v1, v2, v3, v4], {isStatic:true}));
        }

        return result;
    }
}