class Builder
{
    static buildCircleWall(outerR:number, innerR:number, sections:number):Vertex[][]
    {
        var result = [];
        var angleStep = (2 * Math.PI) / sections;
        var centerR = (outerR + innerR) / 2;

        // inner
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

            result.push([v1, v2, v3, v4]);

            /*var x = Math.cos(angle) * innerR;
            var y = Math.sin(angle) * innerR;
            result.push(new Vertex(x, y));*/
        }

        return result;
    }
}