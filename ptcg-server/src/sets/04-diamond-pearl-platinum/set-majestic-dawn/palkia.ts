import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, CONFIRMATION_PROMPT, MOVE_CARDS, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Palkia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Zone Shift',
    cost: [W],
    damage: 0,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  },
  {
    name: 'Pearl Blast',
    cost: [W, W, C, C],
    damage: 60,
    text: 'You may return an Energy card attached to Palkia to your hand. If you do, choose an Energy card attached to the Defending Pokémon and return it to your opponent\'s hand.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Palkia';
  public fullName: string = 'Palkia MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Zone Shift
    if (AFTER_ATTACK(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.opponent);
    }

    // Pearl Blast
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const energiesOnPalkia = player.active.cards.filter(c => c instanceof EnergyCard);
      if (energiesOnPalkia.length === 0) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.active,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false },
        ), selected => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }
          MOVE_CARDS(store, state, player.active, player.hand, { cards, sourceCard: this });

          const defendingEnergies = opponent.active.cards.filter(c => c instanceof EnergyCard);
          if (defendingEnergies.length === 0) {
            return;
          }

          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false },
          ), oppSelected => {
            const oppCards = oppSelected || [];
            if (oppCards.length === 0) {
              return;
            }
            MOVE_CARDS(store, state, opponent.active, opponent.hand, { cards: oppCards, sourceCard: this });
          });
        });
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    return state;
  }
}
