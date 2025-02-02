import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, TrainerCard, Card, ChooseCardsPrompt, GameMessage, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

export class Slowpoke extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 70;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Hold Still',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Heal 30 damage from this Pokémon.'
  },
  {
    name: 'Ideal Fishing Day',
    cost: [CardType.WATER],
    damage: 0,
    text: 'Put an Item card from your discard pile into your hand.'
  }];

  public set: string = 'PGO';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Slowpoke';
  public fullName: string = 'Slowpoke PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const blocked: number[] = [];
      let numItems = 0;
      player.discard.cards.forEach((c, index) => {
        const isItem = c instanceof TrainerCard && c.trainerType === TrainerType.ITEM;
        if (!isItem) {
          blocked.push(index);
        } else {
          numItems++;
        }
      });

      if (numItems === 0) {
        return state;
      }

      let cards: Card[] = [];

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { min: 1, max: 1, allowCancel: false, blocked }
      ), selected => {
        cards = selected || [];

        cards.forEach((card, index) => {
          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
        });

        player.discard.moveCardsTo(cards, player.hand);

        return state;
      });
    }

    return state;
  }
}