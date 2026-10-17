import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_MARKER, ADD_SLEEP_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Uxie extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Memory Out',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your opponent\'s turn, if Uxie is damaged by an opponent\'s attack (even if Uxie is Knocked Out), you may use this power. The Attacking Pokémon can\'t use that attack during your opponent\'s next turn.',
  }];

  public attacks = [{
    name: 'Mind Off',
    cost: [P],
    damage: 10,
    damageCalculation: '+',
    text: 'If you have Mesprit and Azelf in play, this attack does 10 damage plus 20 more damage and the Defending Pokémon is now Asleep.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Uxie';
  public fullName: string = 'Uxie MT';

  public readonly MEMORY_OUT_MARKER = 'MEMORY_OUT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Clear once-per-opponent-turn marker at end of the attacking player's turn
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.MEMORY_OUT_MARKER, this);

    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, {
      source: this,
      requireActiveSpot: false,
    })) {
      const uxieOwner = StateUtils.findOwner(state, effect.target);
      const attackingPlayer = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, uxieOwner, this)) {
        return state;
      }
      if (HAS_MARKER(this.MEMORY_OUT_MARKER, attackingPlayer, this)) {
        return state;
      }

      const attackName = effect.attack.name;
      CONFIRMATION_PROMPT(store, state, uxieOwner, wantToUse => {
        if (!wantToUse) {
          return;
        }
        ADD_MARKER(this.MEMORY_OUT_MARKER, attackingPlayer, this);
        if (!attackingPlayer.active.cannotUseAttacksNextTurnPending.includes(attackName)) {
          attackingPlayer.active.cannotUseAttacksNextTurnPending.push(attackName);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let hasMesprit = false;
      let hasAzelf = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card.name === 'Mesprit') {
          hasMesprit = true;
        }
        if (card.name === 'Azelf') {
          hasAzelf = true;
        }
      });

      if (hasMesprit && hasAzelf) {
        effect.damage += 20;
        ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      }
    }

    return state;
  }
}
