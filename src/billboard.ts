import { Vector3 } from "three";
import { UpdateObject, Context } from "./updateObject";

export class Billboard extends UpdateObject {
    position : Vector3;
    canvas: HTMLCanvasElement;
    textElement: HTMLDivElement;

    constructor (text: string, position: Vector3, context : Context) {
        super(context);
        this.position = position;
        this.canvas = this.renderer.domElement;

    
        this.textElement = document.createElement('div');
        this.textElement.style.position = 'absolute';
        this.textElement.style.width = 'fit-content';
        this.textElement.style.height = 'fit-content';
        this.textElement.style.paddingLeft = '10px';
        this.textElement.style.paddingRight = '10px';
        // TODO change fontSize based on distance to camera
        this.textElement.style.fontSize = '18px';
        this.textElement.style.backgroundColor = "rgba(255,255,255,0.5)";
        this.textElement.style.borderRadius = '10px';
        this.textElement.innerHTML = text;
        document.body.appendChild(this.textElement);
    };


    update(delta : number) {
        var position2D = new Vector3().copy(this.position);
        // map to normalized device coordinate (NDC) space
        position2D.project( this.camera );

        // map to 2D screen space
        position2D.x = Math.round( (   position2D.x + 1 ) * this.canvas.width  / 2 );
        position2D.y = Math.round( ( - position2D.y + 1 ) * this.canvas.height / 2 );
    
        this.textElement.style.top = (position2D.y - this.textElement.offsetHeight / 2) + 'px';
        this.textElement.style.left = (position2D.x - this.textElement.offsetWidth / 2) + 'px';
    }
}