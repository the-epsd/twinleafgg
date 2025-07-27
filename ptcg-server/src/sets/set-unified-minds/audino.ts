import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { ABILITY_USED, AFTER_ATTACK, DRAW_CARDS, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Audino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Hearing',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may draw a card.'
  }];

  public attacks = [{
    name: 'Drain Slap',
    cost: [C, C],
    damage: 30,
    text: 'Heal 30 damage from this Pokémon.'
  }];

  public set: string = 'UNM';
  public name: string = 'Audino';
  public fullName: string = 'Audino UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '177';

  public readonly HEARING_MARKER = 'HEARING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HEARING_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.HEARING_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      DRAW_CARDS(player, 1);

      player.marker.addMarker(this.HEARING_MARKER, this);
      ABILITY_USED(player, this);
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      const healEffect = new HealEffect(effect.player, effect.player.active, 30);
      state = store.reduceEffect(state, healEffect);
    }

    return state;
  }
}