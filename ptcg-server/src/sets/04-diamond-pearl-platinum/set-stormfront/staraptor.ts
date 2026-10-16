import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, MOVE_POKEMON_OFF_BOARD, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Staraptor extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Staravia';
  public hp: number = 120;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Protect Wing',
    powerType: PowerType.POKEBODY,
    text: 'As long as Staraptor is your Active Pokémon, any damage done by attacks from your opponent\'s Stage 2 Evolved Pokémon is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Strong Breeze',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, put 1 of your opponent\'s Benched Pokémon and all cards attached to it on top of your opponent\'s deck. Your opponent shuffles his or her deck afterward.'
  },
  {
    name: 'Clutch',
    cost: [C, C, C],
    damage: 60,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Staraptor';
  public fullName: string = 'Staraptor SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Protect Wing
    if (effect instanceof PutDamageEffect) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      const sourceOwner = StateUtils.findOwner(state, effect.source);
      if (targetOwner === sourceOwner) {
        return state;
      }
      if (targetOwner.active.getPokemonCard() !== this) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, targetOwner, this)) {
        return state;
      }
      const attacker = effect.source.getPokemonCard();
      if (!attacker || attacker.stage !== Stage.STAGE_2) {
        return state;
      }
      effect.damage = Math.max(0, effect.damage - 20);
    }

    // Strong Breeze
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SHUFFLE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false },
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          MOVE_POKEMON_OFF_BOARD(store, state, targets[0], {
            pokemonDestination: opponent.deck,
            sourceCard: this,
          });
          SHUFFLE_DECK(store, state, opponent);
        });
      });
    }

    // Clutch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
