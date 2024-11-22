import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, GameError, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Sunflora extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public evolvesFrom = 'Sunkern';

  public regulationMark = 'F';

  public attacks = [{
    name: 'Bright Beam',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 10,
    text: 'You may discard up to 3 Energy cards from your hand. This attack does 70 more damage for each card you discarded in this way.'
  }];

  public set: string = 'SIT';

  public fullName: string = 'Sunflora SIT';

  public name: string = 'Sunflora';

  public setNumber: string = '6';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard;
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 0, max: 3 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        const damage = cards.length * 70;
        effect.damage += damage;

        player.hand.moveCardsTo(cards, player.discard);

        return state;

      });

    }

    return state;
  }
}