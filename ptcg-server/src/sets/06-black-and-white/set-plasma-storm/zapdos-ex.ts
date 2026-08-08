import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlasmaEnergy } from './plasma-energy';
import {
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class ZapdosEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX, CardTag.TEAM_PLASMA];
  public cardType: CardType = L;
  public hp: number = 170;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Agility',
    cost: [L, C],
    damage: 30,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Powervolt',
    cost: [L, L, C, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If this Pokémon has any Plasma Energy attached to it, this attack does 40 more damage.'
  }];

  public set: string = 'PLS';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zapdos-EX';
  public fullName: string = 'Zapdos-EX PLS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const hasPlasmaEnergy = player.active.cards.some(card => card instanceof PlasmaEnergy);
      if (hasPlasmaEnergy) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
