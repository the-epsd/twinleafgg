import {
  State,
  StoreLike
} from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { AFTER_ATTACK, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ursaluna extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Ursaring';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Peat Hunt',
      damage: 0,
      cost: [CardType.COLORLESS],
      text: 'Put up to 2 cards from your discard pile into your hand.'
    },
    {
      name: 'Bulky Bump',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 200,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '124';

  public name: string = 'Ursaluna';

  public fullName: string = 'Ursaluna ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 0, max: 2, allowCancel: false }, this.attacks[0]);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }

    return state;
  }
}