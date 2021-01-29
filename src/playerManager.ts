import { Player } from "./player";
import { Vector3 } from "three";
import { Context } from "./updateObject";

export class PlayerManager {
    players : Player[] = [];

    circle_radius_min = 7;      // min radius of player circle
    circle_angle_max = Math.PI; // max angle between first and last player
    arc_dist = 2;               // arc distance between adjacent players

    constructor() {
    }

    updatePlayerPositions() {
        var circle_radius = this.circle_radius_min;
        // Increase circle radius if there are too many players
        if (this.arc_dist * this.players.length > this.circle_radius_min * this.circle_angle_max) {
            circle_radius  = this.arc_dist * this.players.length / this.circle_angle_max;
        }

        // Angle between players based on arc distance and circle radius
        var theta = this.arc_dist / circle_radius;

        // Get starting angle based on num players
        var angle = Math.PI/2 - (theta/2 * (this.players.length-1));

        this.players.forEach(player => {
            // Set player position on circle & rotate to face center
            player.rotation = new Vector3(0, -angle - Math.PI/2, 0) ;
            player.position = new Vector3(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(circle_radius);
            angle += theta;
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