import { AnimationClip, AnimationMixer, Bone, LoadingManager, LoopOnce, Material, Mesh,  Object3D, sRGBEncoding, TextureLoader, Vector3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Billboard } from './billboard';
import { UpdateObject } from './updateObject';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'
import { DialogBox } from './dialogbox';
import * as Accessories from './accessories.json';

// TODOs
// animation chaining - statemachine w/ action.crossFadeFrom()
// better commands & explicit playerIDs
// better lighting
// nicer background
// fix nametags
// accessories

interface AnimationInfo {
    animation : AnimationClip,
    loop : boolean,
}

export class Player extends UpdateObject {
    static gltf : GLTF;
    static animations = {};
    static model_scale = 2.0;
    static nametag_height = 4.8;
    static dialog_height = 4.8;
    static accessories;
    name : string;
    model : Object3D;
    model_loaded : boolean = false;
    mixer : AnimationMixer;
    nametag : Billboard;
    dialog_box : DialogBox;
    _skin : string;

    constructor ( name : string) {
        super();
        this.name = name;

        this.nametag = new Billboard(name, new Vector3(0, 0, 0));
        this.nametag.visible = false;

        if (Player.gltf) {
            this.set_model();
        }
    }

    private set_model() {
        this.model_loaded = true;
        this.model = SkeletonUtils.clone(Player.gltf.scene);
        this.model.scale.set( Player.model_scale, Player.model_scale, Player.model_scale );
        UpdateObject.context.scene.add( this.model );
        
        // Set random skin
        let random_skin = skin_files[Math.floor(Math.random() * skin_files.length)].split(".")[0];
        this.skin = random_skin;

        this.mixer = new AnimationMixer( this.model );

        this.change_animation("Idle");
    }

    change_animation(name: string) {
        if (name in Player.animations) {
            let animInfo = Player.animations[name];
            this.mixer.stopAllAction();
            var action = this.mixer.clipAction(animInfo.animation);
            if (!animInfo.loop) { 
                action.setLoop(LoopOnce, 1); 
                action.clampWhenFinished = true;
            }
            action.play();
        } else {
            console.warn(`Animation "${name}" not found!`);
        }     
    }

    set_accessory(name: string) {
        let accessory = Player.accessories[name];
        this.model.traverse( (object) => {
            if (object instanceof Bone) { console.log(object.name)}
            if ( object instanceof Bone && object.name === accessory.bone) {
                let sc = accessory.scene.clone();
                sc.position.x = accessory.position.x;
                sc.position.y = accessory.position.y;
                sc.position.z = accessory.position.z;
                object.add(sc);
            }
        })
    }

    say(message: string) {
        if (this.dialog_box) {
            this.dialog_box.destroy();
        }
        let p = this.position.clone();
        p.y += Player.dialog_height * this.scale;
        this.dialog_box = new DialogBox(message, p, 3);
    }

    set skin(name: string) {
        if (name in skins) {
            var mat; // https://discourse.threejs.org/t/giving-a-glb-a-texture-in-code/15071/6

            this.model.traverse( (object) => {
    
                if ( object instanceof Mesh ) {
                    mat = (<Material>object.material).clone();
                    mat.map = skins[name];
                    mat.needsUpdate = true;
                    object.material = mat;
                } 
             
            });
            this._skin = name;
        } else {
            console.warn(`Skin "${name}" not found!`);
        }
    }

    get skin() {
        return this._skin;
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
        if (this.model) {
            this.model.scale.set(val, val, val);
            this.nametag.position.copy(this.model.position).y += Player.nametag_height * this.scale;
        }
    }

    get scale() {
        return this.model.scale.x;
    }

    update(delta : number) {
        if (this.mixer) { this.mixer.update( delta ) }
        if (!this.model_loaded && Player.gltf) { this.set_model() }
    }
}

// Load all skin textures
var texLoader = new TextureLoader();

// python:
// >>> import os
// >>> os.listdir("assets/skins/")
let skin_files = ['alienA.png', 'alienB.png', 'animalA.png', 'animalB.png', 'animalBaseA.png', 'animalBaseB.png', 'animalBaseC.png', 'animalBaseD.png', 'animalBaseE.png', 'animalBaseF.png', 'animalBaseG.png', 'animalBaseH.png', 'animalBaseI.png', 'animalBaseJ.png', 'animalC.png', 'animalD.png', 'animalE.png', 'animalF.png', 'animalG.png', 'animalH.png', 'animalI.png', 'animalJ.png', 'astroFemaleA.png', 'astroFemaleB.png', 'astroMaleA.png', 'astroMaleB.png', 'athleteFemaleBlue.png', 'athleteFemaleGreen.png', 'athleteFemaleRed.png', 'athleteFemaleYellow.png', 'athleteMaleBlue.png', 'athleteMaleGreen.png', 'athleteMaleRed.png', 'athleteMaleYellow.png', 'businessMaleA.png', 'businessMaleB.png', 'casualFemaleA.png', 'casualFemaleB.png', 'casualMaleA.png', 'casualMaleB.png', 'cyborg.png', 'fantasyFemaleA.png', 'fantasyFemaleB.png', 'fantasyMaleA.png', 'fantasyMaleB.png', 'farmerA.png', 'farmerB.png', 'militaryFemaleA.png', 'militaryFemaleB.png', 'militaryMaleA.png', 'militaryMaleB.png', 'racerBlueFemale.png', 'racerBlueMale.png', 'racerGreenFemale.png', 'racerGreenMale.png', 'racerOrangeFemale.png', 'racerOrangeMale.png', 'racerPurpleFemale.png', 'racerPurpleMale.png', 'racerRedFemale.png', 'racerRedMale.png', 'robot.png', 'robot2.png', 'robot3.png', 'survivorFemaleA.png', 'survivorFemaleB.png', 'survivorMaleA.png', 'survivorMaleB.png', 'zombieA.png', 'zombieB.png', 'zombieC.png'];
let skin_directory = "assets/skins/";

let skins = {};
skin_files.forEach(file => {
    let map = texLoader.load(skin_directory + file);
    map.encoding = sRGBEncoding;
    map.flipY = false;
    skins[file.split(".")[0]] = map;
});


// Load character
const asset_url = 'assets/characterMediumAllAnimations.glb'; 
// Animations in gltf.animations that need to be looped
const loopedAnimations = ["CrouchIdle", "CrouchWalk", "Idle", "RacingIdle", "Run", "Walk", "Jump"]

const manager = new LoadingManager();
const loader = new GLTFLoader(manager);
loader.load(asset_url, ( gltf ) => {

    Player.gltf = gltf;
    gltf.animations.forEach(anim => {

        let animInfo : AnimationInfo = {
            animation : anim,
            loop : loopedAnimations.includes(anim.name),
        };
        Player.animations[anim.name] = animInfo;

    });

}, ( event ) => {
    console.log(`Loading ${asset_url} - ${Math.floor(event.loaded / event.total * 100)}%`);
}, ( reason ) => {
    console.error(`Loading ${asset_url} failed! ${reason}`);
});

for (var accessory in Accessories) {
    let url = `assets/accessories/${accessory}.glb`
    loader.load(url, (gltf) => {
        let filename = url.split("/").pop();
        let accessoryName = filename.split(".")[0];
        Accessories[accessoryName].scene = gltf.scene;
    });
}
manager.onLoad = () => {
    Player.accessories = Accessories;
}

/*
loader.loadAsync(asset_url, ( event ) => {
    console.log(`Loading ${asset_url} - ${Math.floor(event.loaded / event.total * 100)}%`);
}).then( ( gltf ) => {
    Player.gltf = gltf;
}).catch( (reason) => {
    console.error(`Loading ${asset_url} failed! ${reason}`);
});
*/