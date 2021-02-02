import { AnimationMixer, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Billboard } from './billboard';
import { UpdateObject, Context } from './updateObject';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'

export class Player extends UpdateObject {
    static gltf : GLTF;

    name : string;
    model : any;
    mixer : AnimationMixer;
    nametag : Billboard;
    _rotation : Vector3;
    _position : Vector3;

    constructor ( name : string, context : Context) {
        super(context);
        this.name = name;

        this.nametag = new Billboard(name, new Vector3(0, 0, 0), context);

        this.model = SkeletonUtils.clone(Player.gltf.scene);
        this.model.scale.set( 2, 2, 2);
        this.mixer = new AnimationMixer( this.model );
        var action = this.mixer.clipAction(Player.gltf.animations[0]);
        action.play();

        context.scene.add( this.model );
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

const asset_url = 'assets/knight.glb'

const loader = new GLTFLoader();
loader.load(asset_url, ( gltf ) => {
    Player.gltf = gltf;
}, ( event ) => {
    console.log(`Loading ${asset_url} - ${Math.floor(event.loaded / event.total * 100)}%`);
}, ( reason ) => {
    console.error(`Loading ${asset_url} failed! ${reason}`);
});
/*
loader.loadAsync(asset_url, ( event ) => {
    console.log(`Loading ${asset_url} - ${Math.floor(event.loaded / event.total * 100)}%`);
}).then( ( gltf ) => {
    Player.gltf = gltf;
}).catch( (reason) => {
    console.error(`Loading ${asset_url} failed! ${reason}`);
});
*/