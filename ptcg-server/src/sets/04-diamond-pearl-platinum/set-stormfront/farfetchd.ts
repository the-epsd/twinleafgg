import { ChooseCardsPrompt, GameMessage, PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, THIS_ATTACK_DOES_X_MORE_DAMAGE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Farfetchd extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Go and Collect',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Trainer, Supporter, or Stadium card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Fury Cutter',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip 3 coins. If 1 of them is heads, this attack does 10 damage plus 10 more damage. If 2 of them are heads, this attack does 10 damage plus 20 more damage. If all of them are heads, this attack does 10 damage plus 40 more damage.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Farfetch\'d';
  public fullName: string = 'Farfetch\'d SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Go and Collect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }
      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          { superType: SuperType.TRAINER },
          { min: 0, max: 1, allowCancel: false },
        ),
        selected => {
          const cards = selected || [];
          if (cards.length === 0) {
            SHUFFLE_DECK(store, state, player);
            return;
          }
          SHOW_CARDS_TO_PLAYER(store, state, effect.opponent, cards);
          MOVE_CARDS(store, state, player.deck, player.hand, {
            cards,
            sourceCard: this,
            sourceEffect: effect,
          });
          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    // Fury Cutter
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 3, results => {
        const heads = results.filter(r => r).length;
        let damageBonus = 0;
        if (heads === 1) {
          damageBonus = 10;
        } else if (heads === 2) {
          damageBonus = 20;
        } else if (heads === 3) {
          damageBonus = 40;
        }
        THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, damageBonus);
      });
    }

    return state;
  }
}
