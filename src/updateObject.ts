import { Camera, Renderer, Scene } from "three";

export interface Context {
    scene : Scene;
    camera: Camera;
    renderer: Renderer;
    objList : UpdateObject[];
}

export abstract class UpdateObject {
    scene : Scene;
    camera : Camera;
    renderer : Renderer;
    constructor (context : Context) {
        this.scene = context.scene;
        this.camera = context.camera;
        this.renderer = context.renderer;
        context.objList.push(this);
    }
    abstract update(delta : number): void;
}