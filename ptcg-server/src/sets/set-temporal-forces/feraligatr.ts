import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_EFFECT_IF_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';


export class Feraligatr extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Croconaw';
  public cardType: CardType = W;
  public hp: number = 180;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Torrential Heart',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 5 damage counters on this Pokémon. If you do, attacks used by this Pokémon do 120 more damage to your opponent\'s Active Pokémon during this turn (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Giant Wave',
    cost: [W, W],
    damage: 160,
    text: 'This Pokémon can\'t use Giant Wave during your next turn.'
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Feraligatr';
  public fullName: string = 'Feraligatr TEF';

  public readonly TORRENTIAL_HEART_MARKER = 'TORRENTIAL_HEART_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.TORRENTIAL_HEART_MARKER, this);

    if (effect instanceof AttackEffect && effect.source.cards.includes(this) && HAS_MARKER(this.TORRENTIAL_HEART_MARKER, effect.player, this)) {
      effect.damage += 120;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Giant Wave')) {
        player.active.cannotUseAttacksNextTurnPending.push('Giant Wave');
      }
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      BLOCK_EFFECT_IF_MARKER(this.TORRENTIAL_HEART_MARKER, effect.player, this);

      const cardList = StateUtils.findCardList(state, this);
      if (cardList instanceof PokemonCardList) {
        cardList.damage += 50;
        ADD_MARKER(this.TORRENTIAL_HEART_MARKER, effect.player, this);
        ABILITY_USED(effect.player, this);
      }
    }
    return state;
  }
}