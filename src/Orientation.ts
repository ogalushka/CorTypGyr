class Orientation
{
    alpha:number = 0;
    beta:number = 0;
    gamma:number = 0;

    fromEvent(event:DeviceOrientationEvent)
    {
        this.alpha = event.alpha;
        this.beta = event.beta / 90;
        this.gamma = event.gamma / 90;
    }
}