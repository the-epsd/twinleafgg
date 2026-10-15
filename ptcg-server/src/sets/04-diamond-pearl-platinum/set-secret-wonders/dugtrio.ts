import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Dugtrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Diglett';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Dig Trap',
    cost: [F, C],
    damage: 0,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, prevent all effects of an attack, including damage, done to Dugtrio during your opponent\'s next turn. If Dugtrio is your Active Pokémon at the end of your opponent\'s next turn, put 6 damage counters on 1 of your opponent\'s Benched Pokémon.'
  },
  {
    name: 'Pit Trap',
    cost: [F, F, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Your opponent flips a coin. If tails, this attack does 50 damage plus 50 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Dugtrio';
  public fullName: string = 'Dugtrio SW';

  public readonly DIG_TRAP_MARKER = 'DIG_TRAP_MARKER';
  public readonly CLEAR_DIG_TRAP_MARKER = 'CLEAR_DIG_TRAP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dig Trap
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          effect.damage = 0;
          return;
        }
        PREVENT_DAMAGE(store, state, effect, this);
        PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        ADD_MARKER(this.DIG_TRAP_MARKER, player, this);
        ADD_MARKER(this.CLEAR_DIG_TRAP_MARKER, opponent, this);
      });
    }

    // Dig Trap end-of-turn damage
    if (effect instanceof EndTurnEffect && HAS_MARKER(this.CLEAR_DIG_TRAP_MARKER, effect.player, this)) {
      const opponent = effect.player;
      const player = StateUtils.getOpponent(state, opponent);
      REMOVE_MARKER(this.CLEAR_DIG_TRAP_MARKER, opponent, this);
      REMOVE_MARKER(this.DIG_TRAP_MARKER, player, this);

      if (player.active.getPokemonCard() === this) {
        const hasBench = opponent.bench.some(b => b.cards.length > 0);
        if (hasBench) {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            const target = selected && selected[0];
            if (target) {
              store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, 60, this));
            }
          });
        }
      }
    }

    // Pit Trap
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      COIN_FLIP_PROMPT(store, state, opponent, result => {
        if (!result) {
          effect.damage += 50;
        }
      });
    }

    return state;
  }
}
