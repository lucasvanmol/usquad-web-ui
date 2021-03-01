import { Vector3 } from "three";
import { Billboard } from "./billboard"
export class DialogBox extends Billboard {
    timeout: number;
    elapsedTime: number = 0;
    constructor(text: string, position: Vector3, timeout: number) {
        super(text, position, true);
        this.timeout = timeout;
    }

    update(delta: number) {
        super.update(delta);
        this.elapsedTime += delta;
        if (this.elapsedTime > this.timeout) {
            this.destroy();
        }
    }
}