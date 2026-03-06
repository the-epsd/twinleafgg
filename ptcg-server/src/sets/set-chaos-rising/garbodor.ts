import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, PlayerType, PowerType } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase } from '../../game/store/state/state';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Garbodor extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Trubbish';
  public hp: number = 140;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Garbage Downer',
    powerType: PowerType.ABILITY,
    text: 'If your opponent\'s Active Pokemon has any Pokemon Tool attached, its attacks do 20 less damage (before applying Weakness and Resistance).'
  }];
  public attacks = [{
    name: 'Sludge Bomb',
    cost: [D, D, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Garbodor';
  public fullName: string = 'Garbodor M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect && effect.damage > 0 && state.phase === GamePhase.ATTACK) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      if (IS_ABILITY_BLOCKED(store, state, targetOwner, this)) {
        return state;
      }
      let hasGarbodor = false;
      targetOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) hasGarbodor = true;
      });
      StateUtils.getOpponent(state, targetOwner).forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) hasGarbodor = true;
      });
      if (!hasGarbodor) return state;
      const attackerHasTool = effect.source.tools.length > 0;
      if (attackerHasTool) {
        effect.damage = Math.max(0, effect.damage - 20);
      }
    }
    return state;
  }
}
