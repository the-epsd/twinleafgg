import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ADD_BURN_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Victreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Weepinbell';
  public hp: number = 120;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Burning Scent',
    cost: [],
    damage: 0,
    text: 'The Defending Pokémon is now Burned and Poisoned. Before applying these effects, you may switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. The new Defending Pokémon is now Burned and Poisoned.'
  },
  {
    name: 'Energy Dissolve',
    cost: [G, G, C],
    damage: 60,
    text: 'Discard an Energy attached to the Defending Pokémon at the end of your opponent\'s next turn.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Victreebel';
  public fullName: string = 'Victreebel LA';

  private usedLurePoison = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Burning Scent
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedLurePoison = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedLurePoison) {
      this.usedLurePoison = false;
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const applyStatuses = () => {
        ADD_BURN_TO_PLAYER_ACTIVE(store, state, opponent, this);
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
      };
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        applyStatuses();
        return state;
      }
      CONFIRMATION_PROMPT(store, state, player, wantToSwitch => {
        if (!wantToSwitch) {
          applyStatuses();
          return;
        }
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: true },
        ), selected => {
          if (selected && selected.length > 0) {
            opponent.switchPokemon(selected[0]);
          }
          applyStatuses();
        });
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    if (effect instanceof EndTurnEffect) {
      this.usedLurePoison = false;
    }

    // Energy Dissolve
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
    }

    return state;
  }
}
