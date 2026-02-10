import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { MarkerConstants } from '../../game/store/markers/marker-constants';

export class Krookodile extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Krokorok';

  public cardType: CardType = CardType.DARK;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Dark Clamp',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: 'The Defending Pokemon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Bombast',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      damageCalculation: 'x',
      text: 'Does 40 damage times the number of Prize cards you have taken.'
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Krookodile';

  public fullName: string = 'Krookodile DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '66';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dark Clamp - prevent retreat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_RETREAT(store, state, effect, this);
    }

    // Handle marker-based retreat blocking
    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    // Bombast - damage based on prizes taken
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      // Count prize cards taken (6 total minus remaining)
      const prizesTaken = 6 - player.getPrizeLeft();
      (effect as AttackEffect).damage = 40 * prizesTaken;
    }

    return state;
  }

}
