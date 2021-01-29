import { Player } from "./player";
import { Vector3 } from "three";
import { Context } from "./updateObject";

export class PlayerManager {
    players : Player[] = [];

    circle_width = 7; // radius of player circle
    theta = Math.PI/6; // angle between players

    constructor() {
    }

    updatePlayerPositions() {
        // Get starting angle based on num players
        var angle = Math.PI/2 - (this.theta/2 * (this.players.length-1));
        
        this.players.forEach(player => {
            // Set player position on circle & rotate to face center
            player.rotation = new Vector3(0, -angle - Math.PI/2, 0) ;
            player.position = new Vector3(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(this.circle_width);
            angle += this.theta;
        });
        
    }

    addPlayer(name: string, context : Context) {
        // Update player positions only after model is loaded in
        //this.players.push(new Player(name, context, this.updatePlayerPositions.bind(this)));
        
        // Update player positions immediatly (i.e. right as player joins)
        this.players.push(new Player(name, context));
        this.updatePlayerPositions();
    }
}