
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { AndOptions } from "../inputs/AndOptions";
import { OrOptions } from "../inputs/OrOptions";
import { DoNothing } from "../inputs/DoNothing";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class Flooding implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 7;
    public name: string = "Flooding";
    public tags: Array<Tags> = [];
    public text: string = "Place an ocean tile. IF THERE ARE TILES ADJACENT TO THIS OCEAN TILE, YOU MAY REMOVE 4 MEGA CREDITS FROM THE OWNER OF ONE OF THOSE TILES. Lose 1 victory point.";
    public description: string = "Look out for tsunamis";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            let foundSpace: ISpace;
            let foundPlayer: Player | undefined;
            player.setWaitingFor(
                new AndOptions(
                    () => {
                        if (foundPlayer !== undefined) {
                            const adjacentPlayers: Array<Player> = [];
                            game.getAdjacentSpaces(foundSpace).forEach((space) => {
                                if (space.player) {
                                    adjacentPlayers.push(space.player);
                                }
                            });
                            for (let adjacentPlayer of adjacentPlayers) {
                                if (adjacentPlayer.name === foundPlayer.name) {
                                    adjacentPlayer.megaCredits = Math.max(adjacentPlayer.megaCredits - 4, 0);
                                }
                            }
                        }
                        try { game.addOceanTile(player, foundSpace.id); }
                        catch (err) { reject(err); return; }
                        player.victoryPoints--;
                        resolve();
                    },
                    new SelectSpace(this, "Select space for ocean tile", (space: ISpace) => {
                        foundSpace = space;
                    }),
                    new OrOptions(
                        new SelectPlayer(this, game.getPlayers(), "Select adjacent player", (selectedPlayer: Player) => {
                            foundPlayer = selectedPlayer;
                        }),
                        new DoNothing(this, "No adjacent player or do nothing", () => {
                            foundPlayer = undefined;
                        })
                    )
                )                
            );
        });
    }
}