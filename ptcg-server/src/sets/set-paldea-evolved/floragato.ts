import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Floragato extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sprigatito';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public attacks = [
    {
      name: 'Seed Bomb',
      cost: [CardType.GRASS],
      damage: 30,
      text: ''
    },
    {
      name: 'Magic Whip',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
    }
  ];

  public set: string = 'PAL';
  public name: string = 'Floragato';
  public fullName: string = 'Floragato PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public regulationMark = 'G';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      // Legacy implementation:
      // - Set a `magicWhip` flag on attack use and switched on EndTurnEffect.
      // - Used a custom ChoosePokemonPrompt where the opponent chose their replacement Active.
      //
      // Converted to prefab version (SWITCH_OUT_OPPONENT_ACTIVE_POKEMON).
      return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, effect.player, { allowCancel: false });
    }
    return state;
  }
}
