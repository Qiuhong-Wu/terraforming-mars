
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { AndOptions } from "../inputs/AndOptions";

export class Comet implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Comet";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 1 step and place an ocean tile. Remove up to 3 plants from any player.";
    public description: string = "Prepare to be catered!";
    public play(player: Player, game: Game): Promise<void> {
        return game.increaseTemperature(player).then(() => {
            return new Promise<void>((resolve, reject) => {
                player.setWaitingFor(
                    new AndOptions(
                        () => {
                            resolve();
                        },
                        new SelectSpace(this, "Select space for ocean tile", (space: ISpace) => {
                            try { game.addOceanTile(player, space.id); }
                            catch (err) { reject(err); }
                        }),
                        new SelectPlayer(this, game.getPlayers(), "Select player to remove 3 plants", (foundPlayer: Player) => {
                            foundPlayer.plants = Math.max(0, foundPlayer.plants - 3);
                        })
                    )
                );
            });
        });
    }
}