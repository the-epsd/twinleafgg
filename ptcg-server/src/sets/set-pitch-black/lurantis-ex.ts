import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Lurantisex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Fomantis';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 260;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Lively Cutter',
    cost: [G],
    damage: 60,
    damageCalculation: '+',
    text: 'If this Pokémon healed during this turn, this attack does 200 more damage.',
  },
  {
    name: 'Leaf Guard',
    cost: [G, C],
    damage: 140,
    text: 'During your opponent\'s next turn, this Pokémon takes 50 less damage from attacks.',
  }];

  public set: string = 'M5';
  public setNumber: string = '4';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lurantis ex';
  public fullName: string = 'Lurantis ex M5';

  public readonly HEALED_THIS_TURN = 'M5_LURANTIS_EX_HEALED';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof HealEffect && effect.target.getPokemonCard() === this) {
      ADD_MARKER(this.HEALED_THIS_TURN, effect.player, this);
    }
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.HEALED_THIS_TURN, effect.player, this);
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HEALED_THIS_TURN, this);

    if (WAS_ATTACK_USED(effect, 0, this) && HAS_MARKER(this.HEALED_THIS_TURN, effect.player, this)) {
      effect.damage += 200;
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 50;
    }
    return state;
  }
}
