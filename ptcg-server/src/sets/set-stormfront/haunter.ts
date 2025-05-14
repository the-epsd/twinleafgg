import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, TrainerCard, StateUtils, ChooseCardsPrompt, Card, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../game/store/prefabs/attack-effects';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gastly';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: D, value: +20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Smog',
      cost: [],
      damage: 0,
      text: 'The Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Hoodwink',
      cost: [P],
      damage: 30,
      text: 'You may search your opponent\'s discard pile for up to 3 in any combination of Trainer, Supporter, or Stadium cards and put them into your opponent\'s hand.'
    }
  ];

  public set: string = 'SF';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Haunter';
  public fullName: string = 'Haunter SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasValidCard = opponent.discard.cards.some(c => {
        return c instanceof TrainerCard &&
          (c.trainerType === TrainerType.SUPPORTER ||
            c.trainerType === TrainerType.ITEM ||
            c.trainerType === TrainerType.STADIUM);
      });

      if (!hasValidCard) {
        return state;
      }

      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (c instanceof TrainerCard &&
          (c.trainerType === TrainerType.SUPPORTER ||
            c.trainerType === TrainerType.ITEM ||
            c.trainerType === TrainerType.STADIUM)) {
          return;
        } else {
          blocked.push(index);
        }
      });

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        opponent.discard,
        { superType: SuperType.TRAINER },
        { min: 0, max: 3, allowCancel: true, blocked }
      ), selected => {
        cards = selected || [];

        if (cards.length > 0) {
          cards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: opponent.name, card: card.name });
          });

          MOVE_CARDS(store, state, opponent.discard, opponent.hand, { cards: cards });
        }
      });
    }

    return state;
  }
} 