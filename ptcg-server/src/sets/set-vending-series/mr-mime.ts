import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { IS_POKEMON_POWER_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MrMime extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Dampening Shield',
    powerType: PowerType.POKEMON_POWER,
    text: 'As long as this Pokémon is on your Bench, Pokémon in play (both yours and your opponent\'s) have no Weakness or Resistance.'
  }];

  public attacks = [{
    name: 'Juggling',
    cost: [P, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 4 coins. This attack does 10 damage for each heads.'
  }];

  public set: string = 'VS1';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mr. Mime';
  public fullName: string = 'Mr. Mime VS1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Dampening Shield
    if (effect instanceof CheckPokemonStatsEffect) {
      let MrMimeOwner: any = null;

      state.players.forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList === p.active) {
            return;
          }
          if (cardList.getPokemonCard() === this) {
            MrMimeOwner = p;
          }
        });
      });

      if (IS_POKEMON_POWER_BLOCKED(store, state, MrMimeOwner, this)) {
        return state;
      }

      if (!MrMimeOwner) {
        return state;
      }

      effect.weakness = [];
      effect.resistance = [];
    }

    // Attack 1: Juggling
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
    }

    return state;
  }
}
