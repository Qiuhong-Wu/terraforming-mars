import { IProjectCard } from '../IProjectCard';
import { IActionCard, IResourceCard, ICard } from '../ICard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { ResourceType } from '../../ResourceType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { SelectCard } from '../../inputs/SelectCard';
import { Game } from '../../Game';
import { SelectOption } from '../../inputs/SelectOption';
import { OrOptions } from '../../inputs/OrOptions';

export class CometAiming implements IActionCard, IProjectCard, IResourceCard {
    public name: CardName = CardName.COMET_AIMING;
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.SPACE];
    public resourceType: ResourceType = ResourceType.ASTEROID;
    public resourceCount: number = 0;
    public cardType: CardType = CardType.ACTIVE;

    public canPlay(): boolean {
        return true;
    }

    public play() {
        return undefined;
    }

    public canAct(player: Player): boolean {
        return player.titanium > 0 || this.resourceCount > 0;
    }

    public action(player: Player, game: Game) {
        const asteroidCards = player.getResourceCards(ResourceType.ASTEROID);

        const addAsteroidToSelf = function() {
            player.addResourceTo(asteroidCards[0]);
            return undefined;
        }

        const addAsteroidToCard = new SelectCard(
            "Select card to add 1 asteroid", 
            asteroidCards, 
            (foundCards: Array<ICard>) => { 
                player.addResourceTo(foundCards[0]);
                return undefined;
            }
        );

        const spendAsteroidResource = () => {
            this.resourceCount--;
            game.addOceanInterrupt(player);
            return undefined;
        }

        if (this.resourceCount === 0) {
            player.titanium--;
            if (asteroidCards.length === 1) return addAsteroidToSelf();
            return addAsteroidToCard;
        }

        if (player.titanium === 0) return spendAsteroidResource();

        let availableActions = new Array<SelectOption | SelectCard<ICard>>();
        availableActions.push(new SelectOption('Remove an asteroid resource to place an ocean', spendAsteroidResource));

        if (asteroidCards.length === 1) {
            availableActions.push(new SelectOption('Spend 1 titanium to gain 1 asteroid resource', addAsteroidToSelf));
        } else {
            availableActions.push(addAsteroidToCard);
        }
        
        return new OrOptions(...availableActions);
    }
}