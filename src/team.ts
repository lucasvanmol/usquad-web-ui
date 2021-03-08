import { Vector3 } from "three";
import { Billboard } from "./billboard";
import { Player } from "./player";

export class Team {
    name: string;
    players: Player[];
    nameTag: Billboard;

    constructor (name: string, players?: Player[], disableNameTag?: boolean) {
        this.name = name;
        this.players = players || [];

        this.nameTag = new Billboard(name, new Vector3(0, 0, 0));
        this.nameTag.visible = !(disableNameTag || false);
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayer(player: Player) {
        this.players = this.players.filter((p) => p !== player);
    }

    destroy() {
        this.nameTag.destroy();
    }
}