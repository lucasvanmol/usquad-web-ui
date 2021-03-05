import { Player } from "./player";
import { Vector3 } from "three";

export class PlayerManager {
    players : { [name: string]: Player } = {};
    teams : { [name: string]: Player[] } = {};

    circle_radius : number = 8;          // min radius of player circle
    circle_angle_max : number = Math.PI; // max angle between first and last player
    arc_dist : number = 2;               // arc distance between adjacent players

    updatePlayerPositions() {
        var dist = this.arc_dist;
        var scale = Player.model_scale;
        var numPlayers =  Object.keys(this.players).length;

        // Decrease player size if there are too many players
        if (this.arc_dist * numPlayers > this.circle_radius * this.circle_angle_max) {
            dist = this.circle_radius * this.circle_angle_max / numPlayers;
            scale *= (dist / this.arc_dist);
        }

        // Angle between players based on arc distance and circle radius
        var theta = dist / this.circle_radius;

        // Get starting angle based on num players
        var angle = Math.PI/2 - (theta/2 * (numPlayers-1));

        for (var playerName in this.players) {
            // Set player position on circle & rotate to face center
            let player = this.players[playerName];
            player.rotation = new Vector3(0, -angle - Math.PI/2, 0) ;
            player.position = new Vector3(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(this.circle_radius);
            player.scale = scale;
            angle += theta;
        }
        console.log(this.players);
    }

    addPlayer(name: string) {
        this.players[name] = new Player(name);
        this.updatePlayerPositions();
    }

    assignTeam(playerName: string, teamName:string) {
        if (playerName in this.players) {
            if (!(teamName in this.teams)) {
                this.teams[teamName] = [];
            }
            this.teams[teamName].push(this.players[playerName]);
        } else {
            console.warn(`Player ${playerName} does not exist`);
        }
    }
}