import { BoardEffect, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { GameError, GameMessage, PlayerType, PokemonCardList, PowerType, StateUtils, StoreLike, State } from '../../../game';
import {
  ABILITY_USED,
  IS_ABILITY_BLOCKED,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class Spiritomb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [D];
  public retreat = [C];

  public powers = [{
    name: 'Building Spite',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may put 1 damage counter on this Pokémon.'
  }];

  public attacks = [{
    name: 'Anguish Cry',
    cost: [D],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each damage counter on this Pokémon.'
  }];

  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Spiritomb';
  public fullName: string = 'Spiritomb UNB';

  public readonly BUILDING_SPITE_MARKER = 'BUILDING_SPITE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BUILDING_SPITE_MARKER, this);

    // Building Spite
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.BUILDING_SPITE_MARKER, this);
      ABILITY_USED(player, this);

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      store.reduceEffect(
        state,
        new PlaceDamageCountersEffect(player, cardList, 10, this, this.powers[0]),
      );

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, list => {
        if (list.getPokemonCard() === this) {
          list.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }

    // Anguish Cry
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const spiritombDamage = effect.player.active.damage;
      effect.damage += (spiritombDamage * 30 / 10);
    }

    return state;
  }
}
