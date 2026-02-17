import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { AbstractAttackEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Ferrothorn2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ferroseed';
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Iron Defense',
      cost: [M],
      damage: 0,
      text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
    },
    {
      name: 'Power Whip',
      cost: [C, C],
      damage: 0,
      text: 'Does 10 damage for each Energy attached to this Pokémon to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Ferrothorn';
  public fullName: string = 'Ferrothorn EPO 73';

  public readonly IRON_DEFENSE_MARKER = 'IRON_DEFENSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          player.active.marker.addMarker(this.IRON_DEFENSE_MARKER, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const energyCount = player.active.cards.filter(c => c.superType === SuperType.ENERGY).length;
      const damage = 10 * energyCount;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        const target = targets[0];
        const putDamage = new PutDamageEffect(effect, damage);
        putDamage.target = target;
        store.reduceEffect(state, putDamage);
      });
    }

    // Prevent damage and effects
    if (effect instanceof AbstractAttackEffect && effect.target.marker.hasMarker(this.IRON_DEFENSE_MARKER, this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const attacker = effect.player;
      if (player !== attacker) {
        effect.preventDefault = true;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.IRON_DEFENSE_MARKER, this);
    }

    return state;
  }
}
