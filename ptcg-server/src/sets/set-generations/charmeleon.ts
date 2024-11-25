import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, ChooseCardsPrompt, ShowCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Charmeleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 90;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Charmander';

  public attacks = [{
    name: 'Call for Support',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Shuffle your deck afterward. '
  },
  {
    name: 'Slash',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 80,
    text: ''
  }];

  public set: string = 'GEN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'RC4';
  public name: string = 'Charmeleon';
  public fullName: string = 'Charmeleon GEN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);


      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        store.prompt(state, [new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards
        )], () => {
          player.deck.moveCardsTo(cards, player.hand);
        });

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });

    }

    return state;
  }
}