import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { AFTER_ATTACK, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Scizor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Scyther';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Honeycomb Defender',
    powerType: PowerType.POKEBODY,
    text: 'If Scizor has 6 or more damage counters on it, any damage done to Scizor by attacks is reduced by 40 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Accelerate',
    cost: [C, C],
    damage: 30,
    text: 'If the Defending Pokémon is Knocked Out by this attack, prevent all effects of an attack, including damage, done to Scizor during your opponent\'s next turn.'
  },
  {
    name: 'Pound Down',
    cost: [G, G],
    damage: 40,
    damageCalculation: '+',
    text: 'If you don\'t have any Pokémon with any Poké-Powers in play, this attack does 40 damage plus 30 more damage.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Scizor';
  public fullName: string = 'Scizor SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Honeycomb Defender
    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (effect.player === owner) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      if (effect.target.damage >= 60) {
        effect.damage = Math.max(0, effect.damage - 40);
      }
    }

    // Accelerate
    if (AFTER_ATTACK(effect, 0, this)) {
      const opponent = effect.opponent;
      if (opponent.active.cards.length === 0 || opponent.active.getPokemonCard() === undefined) {
        const attackEffect = new AttackEffect(effect.player, effect.opponent, effect.attack);
        PREVENT_DAMAGE(store, state, attackEffect, this);
        PREVENT_EFFECTS_OF_ATTACKS(store, state, attackEffect, this);
      }
    }

    // Pound Down
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let hasPokePower = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card.powers.some(p => p.powerType === PowerType.POKEPOWER)) {
          hasPokePower = true;
        }
      });
      if (!hasPokePower) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
