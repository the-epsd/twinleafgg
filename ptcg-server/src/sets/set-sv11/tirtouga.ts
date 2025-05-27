import { PokemonCard, Stage, CardType, State, StoreLike, StateUtils, TrainerCard, TrainerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Tirtouga extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Antique Cover Fossil';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Ancient Debris',
    cost: [W],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each Item card in your opponent\'s discard pile.'
  },
  {
    name: 'Surf',
    cost: [W, C, C],
    damage: 80,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tirtouga';
  public fullName: string = 'Tirtouga SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let opponentItems = 0;
      opponent.discard.cards.forEach(c => {
        if (c instanceof TrainerCard && c.trainerType === TrainerType.ITEM) {
          opponentItems += 1;
        }
      });
      effect.damage = opponentItems * 30;
    }
    return state;
  }
}
