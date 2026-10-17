import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Feraligatr extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Croconaw';
  public hp: number = 130;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Energy Cyclone',
    cost: [W, W],
    damage: 20,
    damageCalculation: 'x',
    text: 'Choose as many Energy cards from your hand as you like and show them to your opponent. This attack does 20 damage times the number of Energy cards you chose. Put those Energy cards on top of your deck. Shuffle your deck afterward.'
  }, {
    name: 'Breaking Tail',
    cost: [W, C, C],
    damage: 60,
    text: 'Choose 1 card from your opponent\'s hand without looking and discard it.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '8';
  public name: string = 'Feraligatr';
  public fullName: string = 'Feraligatr MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const energiesInHand = player.hand.cards.filter(
        card => card instanceof EnergyCard
      );

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: energiesInHand.length },
      ), cards => {
        cards = cards || [];
        effect.damage = cards.length * 20;
        if (cards.length === 0) {
          return;
        }
        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        MOVE_CARDS(store, state, player.hand, player.deck, { cards, sourceCard: this });
        SHUFFLE_DECK(store, state, player);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.hand.cards.length === 0) {
        return state;
      }
      const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
      const randomCard = opponent.hand.cards[randomIndex];
      MOVE_CARDS(store, state, opponent.hand, opponent.discard, {
        cards: [randomCard],
        sourceCard: this,
      });
    }

    return state;
  }
}
