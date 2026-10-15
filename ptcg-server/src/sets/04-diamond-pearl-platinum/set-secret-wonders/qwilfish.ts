import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';
import { ADD_POISON_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Qwilfish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Balloon Sting',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your opponent\'s turn, if Qwilfish is your Active Pokémon and is damage by an attack (even if Qwilfish is Knocked Out), you may flip a coin. If heads, the Attacking Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
  }];

  public attacks = [{
    name: 'Nerve Shot',
    cost: [W, W],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Qwilfish';
  public fullName: string = 'Qwilfish SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Balloon Sting
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);
      if (IS_POKEPOWER_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }
      return store.prompt(state, new ConfirmPrompt(
        abilityOwner.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantTo => {
        if (!wantTo) {
          return;
        }
        COIN_FLIP_PROMPT(store, state, abilityOwner, result => {
          if (result) {
            const attackingPlayer = effect.player;
            ADD_POISON_TO_PLAYER_ACTIVE(store, state, attackingPlayer, this, 20);
          }
        });
      });
    }

    // Nerve Shot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
