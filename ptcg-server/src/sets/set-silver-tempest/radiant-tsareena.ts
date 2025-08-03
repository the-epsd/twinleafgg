import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { GameError, GameMessage, PokemonCardList } from '../../game';
import { RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';


export class RadiantTsareena extends PokemonCard {

  public tags = [CardTag.RADIANT];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Elegant Heal',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may heal 20 damage from each of your Pokémon.'
  }];

  public attacks = [{
    name: 'Aroma Shot',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'This Pokémon recovers from all Special Conditions.'
  }];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public name: string = 'Radiant Tsareena';

  public fullName: string = 'Radiant Tsareena SIT';

  public readonly ELEGANT_HEAL_MARKER = 'ELEGANT_HEAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.ELEGANT_HEAL_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.ELEGANT_HEAL_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        const healEffect = new HealEffect(player, cardList, 20);
        state = store.reduceEffect(state, healEffect);
        return state;
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ELEGANT_HEAL_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
      return state;
    }

    return state;
  }
}