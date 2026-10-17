import { ChooseCardsPrompt, GameError, GameMessage, PokemonCard, PowerType, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK, USE_ABILITY_ONCE_PER_TURN, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

const FOSSIL_NAMES = ['Helix Fossil', 'Dome Fossil', 'Old Amber'];

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Dome Fossil';
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Ancient Guidance',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, search your deck for Helix Fossil, Dome Fossil, or Old Amber and put it onto your Bench. Shuffle your deck afterward. This power can\'t be used if Kabuto is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Shell Attack',
    cost: [F],
    damage: 20,
    text: ''
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Kabuto';
  public fullName: string = 'Kabuto MD';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // Ancient Guidance
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const openSlots = player.bench.filter(b => b.cards.length === 0);
      const hasFossilInDeck = player.deck.cards.some(c => FOSSIL_NAMES.includes(c.name));
      if (openSlots.length === 0 || !hasFossilInDeck) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        const blocked: number[] = [];
        player.deck.cards.forEach((c, index) => {
          if (!FOSSIL_NAMES.includes(c.name)) {
            blocked.push(index);
          }
        });

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.deck,
          {},
          { min: 1, max: 1, allowCancel: false, blocked }
        ), selected => {
          const cards = selected || [];
          if (cards.length === 0) {
            SHUFFLE_DECK(store, state, player);
            return;
          }
          const slot = openSlots[0];
          store.reduceEffect(state, new PlayPokemonFromDeckEffect(player, cards[0] as PokemonCard, slot));
          SHUFFLE_DECK(store, state, player);
        });
      });

      return state;
    }

    return state;
  }
}
