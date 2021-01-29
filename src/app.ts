import * as THREE from "three";
import { MQTTClient } from "./mqtt";
import { PlayerManager } from './playerManager';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui';
import { Context, UpdateObject } from "./updateObject";

///// MQTT SETUP //////

var client = new MQTTClient(
    "broker.emqx.io", 8083, 
    "clientId",
    onMessageArrived
);

// Connect subscribe & publish buttons
var subButton : HTMLDivElement = <HTMLDivElement>document.getElementById("subscribe-button");
subButton.addEventListener('click', () => { _btnSubscribe(client)} );

var pubButton : HTMLDivElement = <HTMLDivElement>document.getElementById("publish-button");
pubButton.addEventListener('click', () => { _btnPublish(client)} );

///// SCENE, RENDERER, CAMERA, CONTROLS SETUP //////

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
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
controls.target.set(0, 0.5, 0);
camera.updateMatrixWorld();

var context : Context = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    objList: objects,
}


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
scene.add(ambilight);

const ambiFolder = gui.addFolder("Hemisphere Light");
ambiFolder.addColor(new ColorGUIHelper(ambilight, 'color'), 'value').name('amibientColor');
ambiFolder.add(ambilight, 'intensity', 0, 2, 0.01);
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
helper.visible = false;
scene.add(helper);

const dirlightFolder = gui.addFolder("Directional Light");
dirlightFolder.addColor(new ColorGUIHelper(dirlight, 'color'), 'value').name('color');
dirlightFolder.add(dirlight, 'intensity', 0, 2, 0.01);
dirlightFolder.add(dirlight.target.position, 'x', -10, 10).onChange(updateDirlight);
dirlightFolder.add(dirlight.target.position, 'y', -10, 10).onChange(updateDirlight);
dirlightFolder.add(dirlight.target.position, 'z', -10, 10).onChange(updateDirlight);
dirlightFolder.add(helper, 'visible').onChange(updateDirlight).name('debug');
//dirlightFolder.open();
function updateDirlight() {
    dirlight.target.updateMatrixWorld()
    helper.update()
}
updateDirlight();

////// ASSETS //////

var playerManager = new PlayerManager;
var addPlayerButton : HTMLButtonElement = <HTMLButtonElement>document.getElementById("add-player");
addPlayerButton.addEventListener('click', () => { playerManager.addPlayer("Player", context) } )

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( {color: 0x00cc00} );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(0, 0.5, 0);
scene.add( cube );

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
};

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

function _btnPublish(client : MQTTClient) {
    let topic = (<HTMLInputElement>document.getElementById("pub-topic")).value;
    let payload = (<HTMLInputElement>document.getElementById("pub-payload")).value;
    client.publish(topic, payload);
}

function _btnSubscribe(client : MQTTClient) {
    let topic = (<HTMLInputElement>document.getElementById("sub-topic")).value;
    client.subscribe(topic);
}