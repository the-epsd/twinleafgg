import { PokemonCard, CardTag, Stage, CardType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_CANNOT_ATTACK, THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class ArctovishV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 220;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ancient Freeze',
    cost: [W, C, C],
    damage: 80,
    text: 'If the Defending Pokémon is a Pokémon V or a Pokémon-GX, it can\'t attack during your opponent\'s next turn.'
  },
  {
    name: 'Giga Impact',
    cost: [W, W, C, C],
    damage: 220,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arctovish V';
  public fullName: string = 'Arctovish V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ancient Freeze
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const defending = effect.opponent.active.getPokemonCard();
      const isVOrGX = defending && (
        defending.tags.includes(CardTag.POKEMON_V) ||
        defending.tags.includes(CardTag.POKEMON_VMAX) ||
        defending.tags.includes(CardTag.POKEMON_VSTAR) ||
        defending.tags.includes(CardTag.POKEMON_GX) ||
        defending.tags.includes(CardTag.TAG_TEAM)
      );

      if (isVOrGX) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    // Giga Impact
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN(effect.player);
    }

    return state;
  }
}
