import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';

export class GiratinaEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 180;
  public weakness = [{ type: N }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Shred',
      cost: [G, P, C],
      damage: 90,
      text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pokemon.'
    },
    {
      name: 'Dragon Pulse',
      cost: [G, P, C, C],
      damage: 130,
      text: 'Discard the top 3 cards of your deck.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '92';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Giratina-EX';
  public fullName: string = 'Giratina-EX DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Shred - ignore effects on defending Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 90);
    }

    // Attack 2: Dragon Pulse - discard top 3 cards of your deck
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, 3, this, effect);
    }

    return state;
  }
}
