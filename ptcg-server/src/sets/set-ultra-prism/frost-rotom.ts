import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyCard } from '../../game/store/card/energy-card';

export class FrostRotom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C];

  public powers = [{
    name: 'Roto Motor',
    powerType: PowerType.ABILITY,
    text: 'If you have 9 or more Pokémon Tool cards in your discard pile, ignore all Energy in the attack cost of each of this Pokémon\'s attacks.'
  }];

  public attacks = [
    {
      name: 'Frost Crush',
      cost: [W, C],
      damage: 10,
      damageCalculation: '+' as '+',
      text: 'This attack does 20 more damage times the amount of Energy attached to all of your opponent\'s Pokémon.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Frost Rotom';
  public fullName: string = 'Frost Rotom UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Roto Motor (passive - ignore energy cost if 9+ tools in discard)
    // Ref: set-steam-siege/yanmega.ts (Sonic Vision - CheckAttackCostEffect passive)
    if (effect instanceof CheckAttackCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;

      if (player.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const toolCount = player.discard.cards.filter(c =>
        c instanceof TrainerCard && c.trainerType === TrainerType.TOOL
      ).length;

      if (toolCount >= 9) {
        effect.cost = [];
      }
    }

    // Attack 1: Frost Crush
    // Ref: set-guardians-rising/honchkrow.ts (Raven's Claw - counting across opponent's Pokemon)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let totalEnergy = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        totalEnergy += cardList.cards.filter(c => c instanceof EnergyCard).length;
      });

      effect.damage += 20 * totalEnergy;
    }

    return state;
  }
}
