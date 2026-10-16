import { ChooseCardsPrompt, GameMessage, PokemonCard, State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';

export class Drifloon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D, value: +10 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Delivery',
    cost: [],
    damage: 0,
    text: 'Flip a coin. If heads, put any 1 card from your discard pile into your hand.'
  },
  {
    name: 'Reaction',
    cost: [P],
    damage: 20,
    text: 'Switch Drifloon with 1 of your Benched Pokémon.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Drifloon';
  public fullName: string = 'Drifloon MD';

  public usedSwitchAttack1 = false;
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Delivery
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, flipResult => {
      if (flipResult && player.discard.cards.length > 0) {
      store.prompt(state, new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.discard,
      {},
      { min: 1, max: 1, allowCancel: false }
      ), selected => {
      const cards = selected || [];
      cards.forEach(card => {
      MOVE_CARDS(store, state, player.discard, player.hand, { cards: [card], sourceCard: this });
      });
      });
      }
      });
    }

    // Reaction
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedSwitchAttack1 = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedSwitchAttack1) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }
    if (effect instanceof EndTurnEffect) {
      this.usedSwitchAttack1 = false;
    }
    return state;
  }
}
