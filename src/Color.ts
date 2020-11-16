class Color
{
    r:number;
    g:number;
    b:number;
    a:number;

    /**
     * 
     * @param r red from 0 to 255 (default 0)
     * @param g green from 0 to 255 (default 0)
     * @param b blue from 0 to 255 (default 0)
     * @param a alpha from 0 to 255 (default 255)
     */
    constructor (r:number = 0, g:number = 0, b:number = 0, a:number = 255)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    asCanvasString():string
    {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }
    
    asCSSString(): string {
        var value = (this.r << 16) | (this.g << 8) | this.b
        var string = ("000000" + value.toString(16)).substr(-6);
        return `#${string}`;
    }
}