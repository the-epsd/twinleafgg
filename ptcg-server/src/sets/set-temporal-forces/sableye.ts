import { PokemonCard, Stage, CardType, StoreLike, State, CardTarget, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { MOVE_DAMAGE_COUNTERS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Claw Slash',
      cost: [CardType.DARK],
      damage: 20,
      text: ''
    },
    {
      name: 'Damage Collection',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Move any number of damage counters from your opponent\'s Benched Pokémon to their Active Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '107';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blockedFrom: CardTarget[] = [];
      let hasDamagedBench = false;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0 && target.slot !== SlotType.ACTIVE) {
          blockedFrom.push(target);
        }
        if (target.slot === SlotType.ACTIVE) {
          blockedFrom.push(target);
        }
        if (cardList.damage > 0 && target.slot === SlotType.BENCH) {
          hasDamagedBench = true;
        }
      });

      if (!hasDamagedBench) {
        return state;
      }

      const blockedTo: CardTarget[] = [];

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList !== opponent.active) {
          blockedTo.push(target);
        }
      });

      // Legacy implementation:
      // - Built a custom MoveDamagePrompt scoped to opponent targets.
      // - Manually enforced source != opponent active and destination == opponent active.
      // - Moved damage counters one by one from benched sources to opponent active.
      //
      // Converted to prefab version (MOVE_DAMAGE_COUNTERS).
      return MOVE_DAMAGE_COUNTERS(store, state, player, {
        playerType: PlayerType.TOP_PLAYER,
        slots: [SlotType.ACTIVE, SlotType.BENCH],
        min: 0,
        allowCancel: false,
        blockedFrom,
        blockedTo,
        singleDestinationTarget: true
      });
    }
    return state;
  }
}
