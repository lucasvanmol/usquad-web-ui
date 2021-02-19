import * as THREE from "three";
import { MQTTClient } from "./mqtt";
import { PlayerManager } from './playerManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as dat from 'dat.gui';
import { Context, UpdateObject } from "./updateObject";
import config from './config'; 

///// MQTT SETUP //////

var mqttclient = new MQTTClient(
    config.host, config.port, 
    config.clientID,
    onMessageArrived,
    onMQTTConnect,
);

// Connect subscribe & publish buttons
var subButton : HTMLButtonElement = <HTMLButtonElement>document.getElementById("subscribe-button");
subButton.addEventListener('click', () => { _btnSubscribe(mqttclient)} );

var pubButton : HTMLButtonElement = <HTMLButtonElement>document.getElementById("publish-button");
pubButton.addEventListener('click', () => { _btnPublish(mqttclient)} );

///// SCENE, RENDERER, CAMERA, CONTROLS SETUP //////

const renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xAAAAAA);

const clock = new THREE.Clock();
var objects: UpdateObject[] = [];


const camera = new THREE.PerspectiveCamera(
    45,                                         // FOV
    window.innerWidth / window.innerHeight,     // Ratio
    0.1, 1000                                   // Near / Far Clip
);
camera.position.set(0,8,16);

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enablePan = false;
controls.target.set(0, 0.5, 0);
controls.minPolarAngle = controls.getPolarAngle();
controls.maxPolarAngle = controls.getPolarAngle();
let dist = camera.position.distanceTo(controls.target);
controls.minDistance = dist;
controls.maxDistance = dist;
camera.updateMatrixWorld();

var context : Context = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    objList: objects,
};
UpdateObject.context = context;

THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
    console.log(`Loading (${loaded}/${total}): ${url}`);
};
THREE.DefaultLoadingManager.onError = (url) => {
    console.log(`Error loading: ${url}`);
};
THREE.DefaultLoadingManager.onLoad = () => {
    console.log(`Loading Complete`);
};

///// LIGHTING //////

const gui = new dat.GUI();
class ColorGUIHelper {
    object;
    prop: string;
    constructor (object: any, prop: string) {
        this.object = object;
        this.prop = prop;
    }
    get value() { return `#${this.object[this.prop].getHexString()}`}
    set value( hexString: string ) { this.object[this.prop].set(hexString) }
}

// Hemisphere Light
const ambientColor = 0xFFFFFF;
const ambiIntensity = 0.5;
const ambilight = new THREE.AmbientLight(ambientColor, ambiIntensity);
ambilight.visible = false;
scene.add(ambilight);

const ambiFolder = gui.addFolder("Ambient Light");
ambiFolder.addColor(new ColorGUIHelper(ambilight, 'color'), 'value').name('amibientColor');
ambiFolder.add(ambilight, 'intensity', 0, 2, 0.01);
ambiFolder.add(ambilight, 'visible').name('enabled');
//ambiFolder.open()

// Directional light
const dirColor = 0xFFFFFF;
const dirIntensity = 1.35;
const dirlight = new THREE.DirectionalLight(dirColor, dirIntensity);
dirlight.position.set(0, 10, 0);
dirlight.target.position.set(-5, 0, 0);
scene.add(dirlight);
scene.add(dirlight.target);
const helper = new THREE.DirectionalLightHelper(dirlight);
dirlight.visible = false;
helper.visible = false;
scene.add(helper);

const dirlightFolder = gui.addFolder("Directional Light");
dirlightFolder.addColor(new ColorGUIHelper(dirlight, 'color'), 'value').name('color');
dirlightFolder.add(dirlight, 'intensity', 0, 2, 0.01);
dirlightFolder.add(dirlight.target.position, 'x', -10, 10).onChange(updateDirlight);
dirlightFolder.add(dirlight.target.position, 'y', -10, 10).onChange(updateDirlight);
dirlightFolder.add(dirlight.target.position, 'z', -10, 10).onChange(updateDirlight);
dirlightFolder.add(dirlight, 'visible').name('enabled');
dirlightFolder.add(helper, 'visible').onChange(updateDirlight).name('debug');
//dirlightFolder.open();
function updateDirlight() {
    dirlight.target.updateMatrixWorld()
    helper.update()
}
updateDirlight();

////// ASSETS //////

var playerManager = new PlayerManager();
var addPlayerButton : HTMLButtonElement = <HTMLButtonElement>document.getElementById("add-player");
addPlayerButton.addEventListener('click', () => { playerManager.addPlayer("Player", context) });

function load_ground() {
    const texLoader = new THREE.TextureLoader();
    const groundGeometry = new THREE.CylinderGeometry(10, 10, 0.5, 40, 1);
    const groundMaterial = new THREE.MeshPhysicalMaterial( {
        //color: 0xffff00,
        map: texLoader.load('assets/wood_planks.jpg', ( texture ) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.x = 3;
            texture.repeat.y = 3;
        }),
    });
    const ground = new THREE.Mesh( groundGeometry, groundMaterial );
    ground.position.set(0, -0.25, 0);
    scene.add( ground );
    
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    const planeMaterial = new THREE.MeshBasicMaterial( {color: 0x777777} );
    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.visible = false;
    plane.rotation.x = -Math.PI/2;
    plane.position.set(0, -0.20, 0);
    plane.matrixAutoUpdate = false; //static object
    plane.updateMatrix();
    scene.add(plane);
    
    const objFolder = gui.addFolder('Objects');
    objFolder.add(ground, 'visible').name('Stage Enabled');
    objFolder.add(plane, 'visible').name('Plane Enabled');
}
load_ground();

////// SKYBOX ///////

const pmremGenerator = new THREE.PMREMGenerator( renderer );
const loader = new RGBELoader();

// 'assets/gamrig_1k.hdr'
// 'assets/st_fagans_interior_1k.hdr'
loader.load('assets/gamrig_1k.hdr', ( texture ) => {
    const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

    scene.background = envMap;
    scene.environment = envMap;

    texture.dispose();
    pmremGenerator.dispose();
});

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

var animate = function () {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    controls.update();

    objects.forEach(obj => {
        obj.update(delta);
    });

    render();
};

function render() {
    renderer.render(scene, camera);
}
animate();


function onMessageArrived(message : any) {
    console.log("onMessageArrived:"+message.payloadString);

    let subs : HTMLInputElement = <HTMLInputElement>document.getElementById('subscriptions');
    subs.innerHTML = "[" + message.destinationName + "]: " + message.payloadString + "<br />";
    
    // Commands:
    // add playerName - add new player
    let cmd = message.payloadString.split(" ");
    if (cmd[0] === "add") {
        playerManager.addPlayer(cmd[1], context);
    } 
}

function onMQTTConnect() {
    console.log("Connected to " + mqttclient.host + ":" + mqttclient.port);
    subButton.disabled = false;
    pubButton.disabled = false;
}

function _btnPublish(client : MQTTClient) {
    let topic = (<HTMLInputElement>document.getElementById("pub-topic")).value;
    let payload = (<HTMLInputElement>document.getElementById("pub-payload")).value;
    client.publish(topic, payload);
}

function _btnSubscribe(client : MQTTClient) {
    let topic = (<HTMLInputElement>document.getElementById("sub-topic")).value;
    client.subscribe(topic);
}