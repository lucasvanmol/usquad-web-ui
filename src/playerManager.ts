import { Player } from "./player";
import { Vector3 } from "three";
import { Team } from "./team";

export class PlayerManager {
    players: { [name: string]: Player } = {};
    teams: { [name: string]: Team } = {};
    defaultTeam: Team;

    circleRadius: number = 8;          // min radius of player circle
    circleMaxAngle: number = Math.PI;  // max angle between first and last player
    arcDistPlayers: number = 2;        // arc distance between adjacent players
    arcDistTeams: number = 5;          // arc distance between adjacent teams

    constructor () {
        this.defaultTeam = new Team("default", [], true);
        this.teams["default"] = this.defaultTeam;
    }

    updatePlayerPositions() {
        var playerDistScaled = this.arcDistPlayers;
        var teamDistScaled = this.arcDistTeams;
        var scale = Player.model_scale;
        var numPlayers = Object.keys(this.players).length;
        var numTeams = Object.keys(this.teams).length;
        if ( this.defaultTeam.players.length === 0 && this.defaultTeam.name in this.teams )  {numTeams -= 1; }

        // Scale player size & distance between players if there are too many players/teams
        let totalDist = this.arcDistPlayers * (numPlayers + numTeams - 2) + this.arcDistTeams * (numTeams - 1);
        let maxDist = this.circleRadius * this.circleMaxAngle;
        let scaleFactor = totalDist / maxDist;
        if (scaleFactor > 1) {
            teamDistScaled = this.arcDistTeams/scaleFactor;
            playerDistScaled = this.arcDistPlayers/scaleFactor;
            scale /= scaleFactor;
        }

        // Angle between players based on arc distance and circle radius
        var theta = playerDistScaled / this.circleRadius;

        // Angle between teams
        var thetaTeams = teamDistScaled / this.circleRadius;

        // Get starting angle based on num players
        var angle = Math.PI/2 - (theta/2 * (numPlayers-1)) - (thetaTeams/2 * (numTeams-1));
        
        for (var teamName in this.teams) {
            // Set team nametag position
            if (this.teams[teamName].players.length !== 0) {
                this.teams[teamName].nameTag.position = this.teams[teamName].players[0].position;
            }
            
            // Set team player position
            this.teams[teamName].players.forEach(player => {
                // Set player position on circle & rotate to face center
                player.rotation = new Vector3(0, -angle - Math.PI/2, 0);
                player.position = new Vector3(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(this.circleRadius);
                player.scale = scale;
                angle += theta;
            });
            angle += thetaTeams;
        }
    }

    addPlayer(id: string) {
        this.players[id] = new Player(id, this.defaultTeam);
        this.updatePlayerPositions();
    }

    assignTeam(playerName: string, teamName:string) {
        if (playerName in this.players) {
            if (!(teamName in this.teams)) {
                this.teams[teamName] = new Team(teamName);
            }
            let player = this.players[playerName];
            let oldTeam = player.team;
            player.changeTeam(this.teams[teamName]);
            if (oldTeam.players.length === 0 && oldTeam !== this.defaultTeam) {
                oldTeam.destroy();
                delete this.teams[oldTeam.name];
            }
            this.updatePlayerPositions();
        } else {
            console.warn(`Player ${playerName} does not exist`);
        }
    }
}