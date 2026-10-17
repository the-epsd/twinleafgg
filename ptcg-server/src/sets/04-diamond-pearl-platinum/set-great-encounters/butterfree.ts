import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';

export class Butterfree extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Metapod';
  public hp: number = 120;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public retreat = [];

  public attacks = [{
    name: 'Parallel Drain',
    cost: [G],
    damage: 30,
    text: 'After your attack, remove from 1 of your Pokémon the number of damage counters equal to the damage you did to the Defending Pokémon.'
  },
  {
    name: 'Dozing Scales',
    cost: [G, G, C],
    damage: 60,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep. If tails, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Butterfree';
  public fullName: string = 'Butterfree GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Parallel Drain
    if (effect instanceof AfterDamageEffect && effect.attack === this.attacks[0]) {
      if (effect.damage > 0 && effect.player.active.getPokemonCard() === this) {
        const player = effect.player;
        const healAmount = effect.damage;
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const targets = selected || [];
          if (targets.length > 0) {
            const healEffect = new HealEffect(player, targets[0], healAmount);
            store.reduceEffect(state, healEffect);
          }
        });
      }
    }

    // Dozing Scales
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        } else {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
