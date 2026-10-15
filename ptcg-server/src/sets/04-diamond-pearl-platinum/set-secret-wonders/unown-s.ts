import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { ABILITY_USED, COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHOW_CARDS_TO_PLAYER, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownS extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Set',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if you have Unown S, Unown E, and Unown T on your Bench, you may flip a coin. If heads, search your discard pile for an Energy card, show it to your opponent, and put it on top of your deck.',
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Unown [S]';
  public fullName: string = 'Unown [S] SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // Set
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const isOnBench = player.bench.some(slot => slot.getPokemonCard() === this);
      if (!isOnBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const benchNames = new Set<string>();
      player.bench.forEach(slot => {
        const card = slot.getPokemonCard();
        if (card) {
          benchNames.add(card.name);
        }
      });
      const required = ['Unown [S]', 'Unown [E]', 'Unown [T]'];
      if (!required.every(name => benchNames.has(name))) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (!player.discard.cards.some(c => c.superType === SuperType.ENERGY)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DECK,
          player.discard,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          MOVE_CARDS(store, state, player.discard, player.deck, {
            cards,
            sourceCard: this,
            toTop: true,
          });
        });
      });
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        }
      });
    }

    return state;
  }
}
