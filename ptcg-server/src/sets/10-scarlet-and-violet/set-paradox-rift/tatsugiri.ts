import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  CONFIRMATION_PROMPT,
  SEARCH_DECK_FOR_CARDS_TO_HAND,
  SWITCH_ACTIVE_WITH_BENCHED,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';

export class Tatsugiri extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [N];
  public weakness = [];
  public retreat = [C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 20,
    text: '',
  }, {
    name: 'Survival Strategy',
    cost: [C, C],
    damage: 0,
    text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck. You may switch this Pokémon with 1 of your Benched Pokémon.',
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '141';
  public name: string = 'Tatsugiri';
  public fullName: string = 'Tatsugiri PAR';

  public usedSwitchAttack1 = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Survival Strategy
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedSwitchAttack1 = true;
      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        effect.player,
        this,
        {},
        { min: 0, max: 2 },
        this.attacks[1],
      );
    }

    if (effect instanceof AfterAttackEffect && this.usedSwitchAttack1) {
      this.usedSwitchAttack1 = false;
      const player = effect.player;
      if (player.bench.some(b => b.cards.length > 0)) {
        CONFIRMATION_PROMPT(store, state, player, result => {
          if (result) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        });
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.usedSwitchAttack1 = false;
    }

    return state;
  }
}
