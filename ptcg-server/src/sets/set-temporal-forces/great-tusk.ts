import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class GreatTusk extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.ANCIENT];

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 140;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Land Collapse',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Discard the top card of your opponent\'s deck. If you played an Ancient Supporter card from your hand during this turn, discard 3 more cards.'
    },
    {
      name: 'Giant Tusk',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 160,
      text: ''
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public name: string = 'Great Tusk';

  public fullName: string = 'Great Tusk TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Discard 1 card from opponent's deck 
      opponent.deck.moveTo(opponent.discard, 1);

      if (player.ancientSupporter == true) {
        opponent.deck.moveTo(opponent.discard, 3);
      }

      return state;
    }
    return state;
  }
}