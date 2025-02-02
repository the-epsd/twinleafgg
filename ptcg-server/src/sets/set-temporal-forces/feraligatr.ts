import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, PokemonCardList } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_EFFECT_IF_MARKER, REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';


export class Feraligatr extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Croconaw';

  public cardType: CardType = CardType.WATER;

  public hp: number = 180;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Torrential Heart',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 5 damage counters on this Pokémon. If you do, attacks used by this Pokémon do 120 more damage to your opponent\'s Active Pokémon during this turn (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Giant Wave',
    cost: [CardType.WATER, CardType.WATER],
    damage: 160,
    text: 'This Pokémon can\'t use Giant Wave during your next turn.'
  }];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '41';

  public name: string = 'Feraligatr';

  public fullName: string = 'Feraligatr TEF';

  public readonly TORRENTIAL_HEART_MARKER = 'TORRENTIAL_HEART_MARKER';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.TORRENTIAL_HEART_MARKER, this);

    if (effect instanceof AttackEffect && effect.player.marker.hasMarker(this.TORRENTIAL_HEART_MARKER, this))
      effect.damage += 120;

    if (WAS_ATTACK_USED(effect, 0, this)) {
      BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
      ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      BLOCK_EFFECT_IF_MARKER(this.TORRENTIAL_HEART_MARKER, effect.player, this);

      const cardList = StateUtils.findCardList(state, this);
      if (cardList instanceof PokemonCardList) {
        cardList.damage += 50;
        ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
        ABILITY_USED(effect.player, this);
      }

    }
    return state;
  }
}