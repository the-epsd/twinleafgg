import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class CastformSnowyForm extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp = 70;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [];

  public powers = [{
    name: 'Weather Reading',
    text: 'If you have 8 or more Stadium cards in your discard pile, ignore all Energy in this Pokémon\'s attack costs.',
    powerType: PowerType.ABILITY,
    useWhenInPlay: false,
  }];

  public attacks = [{
    name: 'Frosty Typhoon',
    cost: [W, W, C],
    damage: 120,
    text: 'During your next turn, this Pokémon can\'t use Frosty Typhoon.'
  }];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Castform Snowy Form';
  public fullName: string = 'Castform Snowy Form CRE';

  public getColorlessReduction(state: State): number {
    const player = state.players[state.activePlayer];
    const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof TrainerCard && (<TrainerCard>c).trainerType === TrainerType.STADIUM).length;

    return stadiumsInDiscard >= 8 ? 2 : 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Frosty Typhoon')) {
        player.active.cannotUseAttacksNextTurnPending.push('Frosty Typhoon');
      }
    }

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof TrainerCard && (<TrainerCard>c).trainerType === TrainerType.STADIUM).length;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (stadiumsInDiscard >= 8) {

        const costToRemove = 3;

        for (let i = 0; i < costToRemove; i++) {
          let index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          } else {
            index = effect.cost.indexOf(CardType.WATER);
            if (index !== -1) {
              effect.cost.splice(index, 1);
            }
          }
        }
      }
    }

    return state;
  }
}