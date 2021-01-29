import { AnimationMixer, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Billboard } from './billboard';
import { UpdateObject, Context } from './updateObject';

export class Player extends UpdateObject {
    name : string;
    model : any;
    mixer : AnimationMixer;
    nametag : Billboard;
    _rotation : Vector3;
    _position : Vector3;

    constructor ( name : string, context : Context, onLoad?: () => void) {
        super(context);
        const loader = new GLTFLoader();
        this.name = name;

        this.nametag = new Billboard(name, new Vector3(0, 0, 0), context);


        loader.load('assets/knight.glb', ( gltf ) => {
            this.model = gltf.scene;
            if (this._position) { 
                this.model.position.set(this._position.x, this._position.y, this._position.z);
            }
            if (this._rotation) {
                this.model.rotation.set(this._rotation.x, this._rotation.y, this._rotation.z);
            }
            this.model.scale.set( 2, 2, 2);
            this.mixer = new AnimationMixer( this.model );
            var action = this.mixer.clipAction(gltf.animations[0]);
            action.play();

            context.scene.add( this.model );
            if (onLoad) onLoad();
        }, undefined, ( error ) => {
            console.error(error);
        });


    }

    set rotation(val: Vector3) {
        this._rotation = val;
        if (this.model) {
            this.model.rotation.set(val.x, val.y, val.z);
        }
    }

    get rotation() {
        return this._rotation;
    }

    set position(val: Vector3) {
        this._position = val;
        if (this.model) {
            this.model.position.set(val.x, val.y, val.z);
        }
    }

    get position() {
        return this._position;
    }

    update(delta : number) {
        if (this.mixer) { this.mixer.update( delta ) };
        if (this._position) {  this.nametag.position.copy(this._position).y += 2.5};
    }
}