import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, EnergyCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class GalarianStunfiskV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 200;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Metal Skin',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon gets +20 HP for each [M] Energy attached to it.'
  }];

  public attacks = [{
    name: 'Trapping Bite',
    cost: [C, C],
    damage: 60,
    text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if it is Knocked Out), put 12 damage counters on the Attacking Pokémon.'
  }];

  public regulationMark: string = 'D';
  public set: string = 'DAA';
  public setNumber: string = '128';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Galarian Stunfisk V';
  public fullName: string = 'Galarian Stunfisk V DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect
      && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const metalEnergyCount = effect.target.cards.filter(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.METAL)
      ).length;

      effect.hp += 20 * metalEnergyCount;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, { damage: 120 });
    }

    return state;
  }
}
