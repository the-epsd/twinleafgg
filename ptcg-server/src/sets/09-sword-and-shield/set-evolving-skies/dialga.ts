import { PokemonCard, CardTag, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_CANNOT_ATTACK } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Dialga extends PokemonCard {
  protected _tags = [CardTag.SINGLE_STRIKE];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [N];
  public hp: number = 130;
  public retreat = [C, C];

  public attacks = [{
    name: 'Chrono Wind',
    cost: [C, C, C],
    damage: 80,
    text: 'If the Defending Pokémon is a Pokémon V, it can\'t attack during your opponent\'s next turn.'
  },
  {
    name: 'Heavy Impact',
    cost: [P, M, M, C],
    damage: 210,
    text: ''
  }];

  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public setNumber: string = '112';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dialga';
  public fullName: string = 'Dialga EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Chrono Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const defending = effect.opponent.active.getPokemonCard();
      const isV = defending && (
        defending.hasTag(CardTag.POKEMON_V) ||
        defending.hasTag(CardTag.POKEMON_VMAX) ||
        defending.hasTag(CardTag.POKEMON_VSTAR) ||
        defending.hasTag(CardTag.POKEMON_VUNION)
      );

      if (isV) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
