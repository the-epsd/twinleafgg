import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Crabominable extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Crabrawler';
  public cardType: CardType = W;
  public hp: number = 160;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Food Prep',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Attacks used by this Pokémon cost [C] less for each Kofu card in your discard pile.'
  }];

  public attacks = [{
    name: 'Haymaker',
    cost: [W, C, C, C, C],
    damage: 250,
    text: 'During your next turn, this Pokémon can\'t use Haymaker.'
  }
  ];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public name: string = 'Crabominable';
  public fullName: string = 'Crabominable SCR';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Food Prep
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;

      if (effect.player !== player || player.active.getPokemonCard() !== this) {
        return state;
      }

      // i love checking for ability lock woooo
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      let kofuCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof TrainerCard && c.name === 'Kofu') {
          kofuCount += 1;
        }
      });
      const index = effect.cost.indexOf(CardType.COLORLESS);
      effect.cost.splice(index, kofuCount);

      return state;
    }

    // Haymaker
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Haymaker')) {
        player.active.cannotUseAttacksNextTurnPending.push('Haymaker');
      }
    }

    return state;
  }
}