import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, StateUtils } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN } from "../../../game/store/prefabs/prefabs";

export class SalamenceEX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_EX];
  public hp: number = 180;
  public cardType: CardType = N;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Beastly Fang',
    cost: [R, C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each of your opponent\'s Pokémon-EX.'
  },
  {
    name: 'Dragon Strike',
    cost: [R, W, C, C],
    damage: 130,
    text: 'This Pokémon can\'t use Dragon Strike during your next turn.'
  }];

  public set: string = 'XYP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '170';
  public name: string = 'Salamence-EX';
  public fullName: string = 'Salamence-EX XYP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Beastly Fang
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let exCount = 0;
      // Check active Pokemon
      if (opponent.active.EXPokemon()) {
        exCount++;
      }
      // Check bench
      for (const benchSlot of opponent.bench) {
        if (benchSlot.EXPokemon()) {
          exCount++;
        }
      }
      effect.damage += 50 * exCount;
    }

    // Dragon Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(effect.player, this.attacks[1]);
    }

    return state;
  }
}
