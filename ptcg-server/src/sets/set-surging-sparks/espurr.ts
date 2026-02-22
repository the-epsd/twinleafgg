import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ShowCardsPrompt, StateUtils } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Espurr extends PokemonCard {

  public tags = [];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'See Through',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Your opponent reveals their hand.'
    },

    {
      name: 'Psyshot',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'SSP';

  public setNumber = '84';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Espurr';

  public fullName: string = 'Espurr SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // See Through
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_EFFECT,
        opponent.hand.cards,
      ), () => { });
    }

    return state;
  }
}