import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, SpecialCondition } from '../../game';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';


export class Nidoking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorino';
  public cardType: CardType = CardType.DARK;
  public hp: number = 170;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Enthusiastic King',
    powerType: PowerType.ABILITY,
    text: 'If you have Nidoqueen in play, ignore all Energy in the costs of attacks used by this Pokémon.'
  }];
  public attacks = [{
    name: 'Venomous Impact',
    cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 190,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Nidoking';
  public fullName: string = 'Nidoking MEW';

  public getColorlessReduction(state: State): number {
    const player = StateUtils.findOwner(state, this.cards);
    const hasNidoqueen = player.bench.some(b => b.cards[0].name === 'Nidoqueen');
    return hasNidoqueen ? 2 : 0;
  }

  public getDarkReduction(state: State): number {
    const player = StateUtils.findOwner(state, this.cards);
    const hasNidoqueen = player.bench.some(b => b.cards[0].name === 'Nidoqueen');
    return hasNidoqueen ? 2 : 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let hasNidoqueen = false;

      player.bench.forEach(benchSpot => {
        if (benchSpot.getPokemonCard()?.name == 'Nidoqueen') {
          hasNidoqueen = true;
        }
      });

      if (hasNidoqueen) {

        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          console.log(effect.cost);
          return state;
        }

        const costToRemove = 4;

        for (let i = 0; i < costToRemove; i++) {
          let index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          } else {
            index = effect.cost.indexOf(CardType.DARK);
            if (index !== -1) {
              effect.cost.splice(index, 1);
            }
          }
          console.log(effect.cost);
        }
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.addSpecialCondition(SpecialCondition.POISONED);
    }

    return state;
  }
}
