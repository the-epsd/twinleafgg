import { PokemonCard, Stage, CardType, CardTag, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

/** #49 — Fighting Lightning */
export class Pikachu49 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C, C, C];
  public attacks = [
    {
      name: 'Fighting Lightning',
      cost: [L, C, C],
      damage: 20,
      damageCalculation: '+',
      text: "If your opponent's Active Pokémon is a Pokémon ex, this attack does 80 more damage.",
    },
  ];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 49';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fighting Lightning
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const defending = effect.opponent.active.getPokemonCard();
      if (defending?.hasTag(CardTag.POKEMON_ex)) {
        effect.damage += 80;
      }
    }
    return state;
  }
}
