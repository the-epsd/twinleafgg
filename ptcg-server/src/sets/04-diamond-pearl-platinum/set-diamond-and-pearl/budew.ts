import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, GameError, GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { MOVE_CARD_TO, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Budew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 40;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Baby Evolution',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may put Roselia from your hand onto Budew (this counts as evolving Budew) and remove all damage counters from Budew.'
  }];

  public attacks = [{
    name: 'Errand-Running',
    cost: [],
    damage: 0,
    text: 'Search your deck for a Trainer card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Budew';
  public fullName: string = 'Budew DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const hasRoselia = player.hand.cards.some(card => card instanceof PokemonCard && card.name === 'Roselia');

      if (!hasRoselia) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name !== 'Roselia') {
          blocked.push(index);
        }
      });

      let selectedCards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.hand,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: true, blocked }
      ), selected => {
        selectedCards = selected || [];
        if (selectedCards.length === 0) {
          return;
        }

        const evolution = selectedCards[0] as PokemonCard;
        const target = StateUtils.findCardList(state, this);

        MOVE_CARDS(store, state, player.hand, target, { cards: [evolution], sourceCard: this });
        const pokemonTarget = target as PokemonCardList;
        pokemonTarget.clearEffects();
        pokemonTarget.pokemonPlayedTurn = state.turn;

        const healEffect = new HealEffect(player, pokemonTarget, pokemonTarget.damage);
        store.reduceEffect(state, healEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.deck.cards.length === 0) {
        return state;
      }
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false }
      ), cards => {
        if (!cards || cards.length === 0) {
          SHUFFLE_DECK(store, state, player);
          return;
        }
        cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
