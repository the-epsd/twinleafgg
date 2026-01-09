import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ArvensMabosstiffex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Arven\'s Maschiff';
  public tags = [CardTag.POKEMON_ex, CardTag.ARVENS];
  public cardType: CardType = D;
  public hp: number = 270;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Hustle Tackle',
    cost: [C],
    damage: 30,
    damageCalculation: '+',
    text: 'If this Pokemon has no damage counters on it, this attack does 120 more damage.'
  },
  {
    name: 'Boss\'s Headbutt',
    cost: [C, C, C],
    damage: 210,
    text: 'During your next turn, this Pokémon can\'t use Boss\'s Headbutt.'
  }];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Arven\'s Mabosstiff ex';
  public fullName: string = 'Arven\'s Mabosstiff ex DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hustle Tackle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.active.damage === 0) {
        effect.damage += 120;
      }
    }

    // Boss's Headbutt
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Boss\'s Headbutt')) {
        player.active.cannotUseAttacksNextTurnPending.push('Boss\'s Headbutt');
      }
    }

    return state;
  }
}