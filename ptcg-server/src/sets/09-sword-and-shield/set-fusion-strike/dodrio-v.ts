import { PokemonCard, CardTag, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from "../../../game/store/prefabs/prefabs";
import { NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS } from "../../../game/store/prefabs/attack-effects";

export class DodrioV extends PokemonCard {
  protected _tags = [CardTag.POKEMON_V, CardTag.RAPID_STRIKE];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 200;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'No Reprieve',
      cost: [C],
      damage: 20,
      text: "During your next turn, this Pokémon's attacks do 80 more damage to your opponent's Active Pokémon (before applying Weakness and Resistance).",
    },
    {
      name: 'Rampage Drill',
      cost: [C, C, C],
      damage: 160,
      text: 'This Pokémon also does 30 damage to itself.',
    },
  ];

  public regulationMark: string = 'E';
  public set: string = 'FST';
  public setNumber: string = '201';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dodrio V';
  public fullName: string = 'Dodrio V FST 201';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // No Reprieve
    NEXT_TURN_ATTACK_BONUS_ALL_ATTACKS(effect, {
      source: this,
      bonusDamage: 80,
      setupAttack: this.attacks[0],
    });

    // Rampage Drill
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}
