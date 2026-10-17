import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, Player, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonAttacksEffect } from '../../../game/store/effects/check-effects';
import { CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class UnownL extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'LINK',
    powerType: PowerType.POKEBODY,
    text: 'Unown L can use any attack from any Unown in play (both yours and your opponent\'s). (You still have to pay for that attack\'s Energy cost.)'
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [P, C],
    damage: 0,
    text: 'Search either player\'s discard pile for up to any 2 cards, show them to your opponent, and put them on top of that player\'s deck in any order you like.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Unown [L]';
  public fullName: string = 'Unown [L] GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // LINK
    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      const opponent = StateUtils.getOpponent(state, player);
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card !== this && card.name.startsWith('Unown')) {
          effect.attacks.push(...(card.attacks || []));
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_cardList, card) => {
        if (card.name.startsWith('Unown')) {
          effect.attacks.push(...(card.attacks || []));
        }
      });
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return CONFIRMATION_PROMPT(store, state, player, useOwnDiscard => {
        const targetPlayer = useOwnDiscard ? player : opponent;
        if (targetPlayer.discard.cards.length === 0) {
          const other = useOwnDiscard ? opponent : player;
          if (other.discard.cards.length === 0) {
            return;
          }
          chooseFromDiscard(store, state, player, opponent, other);
          return;
        }
        chooseFromDiscard(store, state, player, opponent, targetPlayer);
      }, GameMessage.CHOOSE_CARDS);
    }

    return state;
  }
}

function chooseFromDiscard(
  store: StoreLike,
  state: State,
  player: Player,
  opponent: Player,
  targetPlayer: Player
): void {
  store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    targetPlayer.discard,
    {},
    { min: 0, max: Math.min(2, targetPlayer.discard.cards.length), allowCancel: true }
  ), selected => {
    const cards = selected || [];
    if (cards.length === 0) {
      return;
    }
    SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
    cards.reverse().forEach(c => targetPlayer.discard.moveCardTo(c, targetPlayer.deck));
  });
}
