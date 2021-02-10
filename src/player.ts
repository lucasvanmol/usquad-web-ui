import { AnimationMixer, Object3D, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Billboard } from './billboard';
import { UpdateObject, Context } from './updateObject';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'

export class Player extends UpdateObject {
    static gltf : GLTF;
    static model_scale = 2
    static nametag_height = 1.25;
    name : string;
    model : Object3D;
    mixer : AnimationMixer;
    nametag : Billboard;

    constructor ( name : string, context : Context) {
        super(context);
        this.name = name;

        this.nametag = new Billboard(name, new Vector3(0, 0, 0), context);

        this.model = SkeletonUtils.clone(Player.gltf.scene);
        this.model.scale.set( Player.model_scale, Player.model_scale, Player.model_scale );
        context.scene.add( this.model );
       
        this.mixer = new AnimationMixer( this.model );
        var action = this.mixer.clipAction(Player.gltf.animations[0]);
        action.play();
    }

    set rotation(val: Vector3) {
        if (this.model) {
            this.model.rotation.set(val.x, val.y, val.z);
        }
    }

    get rotation() {
        return this.model.rotation.toVector3();
    }

    set position(val: Vector3) {
        if (this.model) {
            this.model.position.set(val.x, val.y, val.z);
            this.nametag.position.copy(this.model.position).y += Player.nametag_height * this.scale;
        }
    }

    get position() {
        return this.model.position;
    }

    set scale(val : number) {
        this.model.scale.set(val, val, val);
        this.nametag.position.copy(this.model.position).y += Player.nametag_height * this.scale;
    }

    get scale() {
        return this.model.scale.x;
    }

    update(delta : number) {
        if (this.mixer) { this.mixer.update( delta ) }
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