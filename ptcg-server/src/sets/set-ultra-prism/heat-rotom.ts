import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { TrainerCard } from '../../game/store/card/trainer-card';

export class HeatRotom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Roto Motor',
    powerType: PowerType.ABILITY,
    text: 'If you have 9 or more Pokémon Tool cards in your discard pile, ignore all Energy in the attack cost of each of this Pokémon\'s attacks.'
  }];

  public attacks = [
    {
      name: 'Heat Blast',
      cost: [R, C, C],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Heat Rotom';
  public fullName: string = 'Heat Rotom UPR';

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

    return state;
  }
}
