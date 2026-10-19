export class OrientationSystem{
 static viewport(width,height){return width>height?"landscape":"portrait";}
 static screen(screen){return screen?.orientation?.type??null;}
}
