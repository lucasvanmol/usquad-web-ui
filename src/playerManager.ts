import { Player } from "./player";
import { Vector3 } from "three";

export class PlayerManager {
    players : Player[] = [];

    circle_radius = 8;          // min radius of player circle
    circle_angle_max = Math.PI; // max angle between first and last player
    arc_dist = 2;               // arc distance between adjacent players

    updatePlayerPositions() {
        var dist = this.arc_dist;
        var scale = Player.model_scale;

        // Decrease player size if there are too many players
        if (this.arc_dist * this.players.length > this.circle_radius * this.circle_angle_max) {
            dist = this.circle_radius * this.circle_angle_max / this.players.length;
            scale *= (dist / this.arc_dist);
        }

        // Angle between players based on arc distance and circle radius
        var theta = dist / this.circle_radius;

        // Get starting angle based on num players
        var angle = Math.PI/2 - (theta/2 * (this.players.length-1));

        this.players.forEach(player => {
            // Set player position on circle & rotate to face center
            player.rotation = new Vector3(0, -angle - Math.PI/2, 0) ;
            player.position = new Vector3(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(this.circle_radius);
            player.scale = scale;
            angle += theta;
        });
        
    }

    addPlayer(name: string) {
        this.players.push(new Player(name));
        this.updatePlayerPositions();
    }
}