import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "../../../game/store/prefabs/prefabs";
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from "../../../game/store/prefabs/effect-of-attack-prefabs";
import { NEXT_TURN_ATTACK_BONUS } from "../../../game/store/prefabs/attack-effects";

export class Swellow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Taillow';
  public cardType: CardType[] = [C];
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Agility',
    cost: [C],
    damage: 20,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  },
  {
    name: 'Swallow Dive',
    cost: [C],
    damage: 40,
    damageCalculation: '+',
    text: 'If this Pokémon used Agility during your last turn, this attack does 80 more damage.'
  }];

  public set: string = 'GRI';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swellow';
  public fullName: string = 'Swellow GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Agility
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    // Agility → Swallow Dive next-turn damage bonus
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[1],
      setupAttack: this.attacks[0],
      source: this,
      bonusDamage: 80,
    });

    return state;
  }
}
