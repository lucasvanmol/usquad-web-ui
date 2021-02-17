import { Camera, Renderer, Scene } from "three";

export interface Context {
    scene : Scene;
    camera: Camera;
    renderer: Renderer;
    objList : UpdateObject[];
}

export abstract class UpdateObject {
    static context : Context;
    constructor (context : Context) {
        UpdateObject.context.objList.push(this);
    }
    abstract update(delta : number): void;
}