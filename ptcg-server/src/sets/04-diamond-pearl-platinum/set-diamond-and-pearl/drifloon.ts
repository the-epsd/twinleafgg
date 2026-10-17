import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_POKEMON_OFF_BOARD, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';

export class Drifloon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Blowing Wind',
    cost: [P],
    damage: 0,
    text: 'Flip a coin. If heads, put 1 of your Benched Pokémon and all cards attached to on top of your deck. Shuffle your deck afterward.'
  },
  {
    name: 'Ominous Wind',
    cost: [P, C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused and can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Drifloon';
  public fullName: string = 'Drifloon DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blowing Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
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
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1 }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          MOVE_POKEMON_OFF_BOARD(store, state, targets[0], {
            pokemonDestination: player.deck,
            sourceCard: this,
          });
          SHUFFLE_DECK(store, state, player);
        });
      });
    }

    // Ominous Wind
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
          BLOCK_RETREAT(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
