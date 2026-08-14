import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class WhimsicottV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_V];
  public cardType: CardType = P;
  public hp: number = 190;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Fluff Gets in the Way',
      cost: [P],
      damage: 20,
      text: "If the Defending Pokémon is a Basic Pokémon, it can't attack during your opponent's next turn.",
    },
    {
      name: 'Cotton Guard',
      cost: [P, C, C],
      damage: 90,
      text: "During your opponent's next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).",
    },
  ];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Whimsicott V';
  public fullName: string = 'Whimsicott V BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fluff Gets in the Way
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    // Cotton Guard
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    return state;
  }
}
