import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, CardTarget, PlayerType, SlotType } from '../../game';
import { MOVE_DAMAGE_COUNTERS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ninetales extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Vulpix';
  public hp: number = 120;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Nine-tailed Reflect',
    cost: [R],
    damage: 0,
    text: 'Move all damage counters from 1 of your opponent\'s Benched Pokemon to their Active Pokemon.'
  },
  {
    name: 'Will-o-Wisp',
    cost: [R, R],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Ninetales';
  public fullName: string = 'Ninetales M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
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
      return MOVE_DAMAGE_COUNTERS(store, state, player, {
        playerType: PlayerType.TOP_PLAYER,
        slots: [SlotType.ACTIVE, SlotType.BENCH],
        min: 0,
        allowCancel: false,
        blockedFrom,
        blockedTo,
        singleSourceTarget: true,
        singleDestinationTarget: true
      });
    }
    return state;
  }
}
