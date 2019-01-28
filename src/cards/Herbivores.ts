
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class Herbivores implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Herbivores";
    public animals: number = 0;
    public text: string = "Requires 8% oxygen. Add 1 animal to this card. Decrease any plant production 1 step. When you place a greenery tile, add an animal to this card. 1 VP per 2 animals on this card.";
    public description: string = "Inhabiting the green hills of Mars";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (game.getOxygenLevel() < 8) {
                reject("Requires 8% oxygen.");
                return;
            }
            player.setWaitingFor(new SelectPlayer(this, game.getPlayers(), "Select player to decrease plant production", (foundPlayer: Player) => {
                if (foundPlayer.plantProduction < 1) {
                    reject("Player must have plant production");
                    return;
                }
                foundPlayer.plantProduction--;
                this.animals++;
                game.addGreeneryPlacedListener((placedPlayer: Player) => {
                    if (placedPlayer === player) {
                        this.animals++;
                    }
                });
                game.addGameEndListener(() => {
                    player.victoryPoints += Math.floor(this.animals / 2);
                });
                resolve();
            }));
        });
    }
}