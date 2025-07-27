import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { GameError } from '../../game/game-error';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Scratch',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: ''
  }, {
    name: 'Lost Mine',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'You can use this attack only if you have 10 or more cards in the Lost Zone. Put 12 damage counters on your opponent\'s Pokémon in any way you like.'
  }];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '70';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (player.lostzone.cards.length <= 9) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(12, store, state, effect);
    }

    return state;
  }
}